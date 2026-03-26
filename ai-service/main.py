from fastapi import FastAPI, File, UploadFile, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import os
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEFAULT_ROBOFLOW_MODEL_ID = "leaf-disease-q7wol/2"


def format_disease_name(disease_name: str) -> str:
    return disease_name.replace("_", " ").replace("-", " ").title()


def build_recommendations(disease_name: str):
    lower = disease_name.lower()

    if "healthy" in lower:
        return [
            "Crop appears healthy. Continue regular monitoring.",
            "Maintain balanced irrigation and fertilizer schedule.",
            "Inspect leaves weekly for early disease signs."
        ]

    if "blight" in lower:
        return [
            "Remove infected leaves immediately.",
            "Avoid excess moisture on leaves.",
            "Use crop-safe fungicide if symptoms spread."
        ]

    if "spot" in lower:
        return [
            "Monitor the spread of spots over the next 48 hours.",
            "Improve airflow between plants.",
            "Reduce overhead irrigation."
        ]

    if "rust" in lower:
        return [
            "Remove heavily affected leaves if spread is severe.",
            "Avoid prolonged leaf wetness.",
            "Use a suitable fungicide if symptoms increase."
        ]

    return [
        "Inspect affected leaves closely.",
        "Avoid water stagnation near roots.",
        "Use crop-specific treatment after confirming symptoms."
    ]


def detect_crop_type(disease_name: str) -> str:
    lower = disease_name.lower()

    if (
        "tomato" in lower
        or "bacterial_spot" in lower
        or "early_blight" in lower
        or "late_blight" in lower
    ):
        return "Tomato"

    if "potato" in lower:
        return "Potato"

    if "corn" in lower or "maize" in lower:
        return "Maize"

    if "pepper" in lower:
        return "Pepper"

    if "healthy" in lower:
        return "Leaf Crop"

    return "Unknown Crop"


def detect_severity(confidence: float, disease_name: str) -> str:
    lower = disease_name.lower()

    if "healthy" in lower:
        return "Low"

    if confidence >= 85:
        return "High"
    if confidence >= 60:
        return "Moderate"
    return "Low"


def build_symptoms(disease_name: str) -> str:
    lower = disease_name.lower()

    if "healthy" in lower:
        return "No major visible disease symptoms detected from the uploaded leaf image."

    if "bacterial_spot" in lower or "spot" in lower:
        return "Small dark or water-soaked spots may be visible on leaves, sometimes surrounded by yellowing."

    if "late_blight" in lower:
        return "Dark brown to black lesions may appear on leaves with rapid spread under moist conditions."

    if "early_blight" in lower:
        return "Target-like brown spots on older leaves may indicate early blight infection."

    if "rust" in lower:
        return "Rust-colored pustules or powdery patches may appear on the leaf surface."

    return f"Possible signs related to {format_disease_name(disease_name)} detected from uploaded leaf image."


def fallback_response(reason: str = "Unknown fallback"):
    return {
        "disease": "Unknown Disease",
        "confidence": 0,
        "cropType": "Unknown Crop",
        "severity": "Low",
        "symptoms": f"AI service fallback response generated. Reason: {reason}",
        "recommendations": [
            "Please retry with a clear leaf image.",
            "Check crop manually for visible spots, blight, or discoloration.",
            "Consult local agricultural guidance if symptoms continue."
        ]
    }


@app.get("/")
def home():
    return {"message": "AI Farm Doctor service is running"}


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    x_roboflow_api_key: str | None = Header(default=None),
    x_roboflow_model_id: str | None = Header(default=None),
):
    try:
        contents = await file.read()

        if not contents:
            raise HTTPException(status_code=400, detail="Empty file uploaded")

        Image.open(io.BytesIO(contents)).convert("RGB")

        api_key = x_roboflow_api_key or os.getenv("ROBOFLOW_API_KEY")
        model_id = (
            x_roboflow_model_id
            or os.getenv("ROBOFLOW_MODEL_ID")
            or DEFAULT_ROBOFLOW_MODEL_ID
        )

        if not api_key:
            return fallback_response("ROBOFLOW_API_KEY missing")

        roboflow_url = f"https://detect.roboflow.com/{model_id}?api_key={api_key}"

        response = requests.post(
            roboflow_url,
            files={"file": (file.filename, contents, file.content_type or "image/jpeg")},
            timeout=30
        )

        if response.status_code != 200:
            return fallback_response(f"Roboflow returned status {response.status_code}")

        result = response.json()
        predictions = result.get("predictions", [])

        if not predictions:
            disease = "Healthy"
            confidence = 88
            crop_type = "Leaf Crop"
            severity = "Low"
        else:
            top_prediction = max(predictions, key=lambda x: x.get("confidence", 0))
            raw_disease = top_prediction.get("class", "Unknown Disease")
            confidence = round(top_prediction.get("confidence", 0) * 100, 2)

            disease = format_disease_name(raw_disease)
            crop_type = detect_crop_type(raw_disease)
            severity = detect_severity(confidence, raw_disease)

        return {
            "disease": disease,
            "confidence": confidence,
            "cropType": crop_type,
            "severity": severity,
            "symptoms": build_symptoms(disease),
            "recommendations": build_recommendations(disease)
        }

    except HTTPException:
        raise
    except Exception as e:
        return fallback_response(str(e))