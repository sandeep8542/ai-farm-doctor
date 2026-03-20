from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

    return [
        "Inspect affected leaves closely.",
        "Avoid water stagnation near roots.",
        "Use crop-specific treatment after confirming symptoms."
    ]

@app.get("/")
def home():
    return {"message": "AI Farm Doctor service is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()

    image = Image.open(io.BytesIO(contents)).convert("RGB")
    width, height = image.size

    # safe mock AI logic for integration stage
    # later we can replace only this block with real model/API
    if width >= height:
        disease = "Late Blight"
        confidence = 92
        crop_type = "Tomato"
        severity = "High"
    else:
        disease = "Healthy"
        confidence = 88
        crop_type = "Leaf Crop"
        severity = "Low"

    return {
        "disease": disease,
        "confidence": confidence,
        "cropType": crop_type,
        "severity": severity,
        "symptoms": f"Possible signs related to {disease} detected from uploaded leaf image.",
        "recommendations": build_recommendations(disease)
    }