const Detection = require("../models/Detection");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://127.0.0.1:8000/predict";

exports.detectDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "Image is required" });
    }

    const imagePath = path.join(__dirname, "..", "uploads", req.file.filename);

    let aiResult = {
      disease: "Unknown Disease",
      symptoms:
        "AI service unavailable. Unable to analyze the uploaded crop image at this moment.",
      recommendations: [
        "Please retry with a clear image.",
        "Inspect the crop manually for visible lesions or discoloration.",
        "Consult local agricultural guidance if symptoms continue.",
      ],
      confidence: 0,
      severity: "Low",
      cropType: "Unknown Crop",
    };

    try {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(imagePath));

      const aiResponse = await axios.post(AI_SERVICE_URL, formData, {
        headers: {
          ...formData.getHeaders(),
          "x-roboflow-api-key": process.env.ROBOFLOW_API_KEY || "",
          "x-roboflow-model-id":
            process.env.ROBOFLOW_MODEL_ID || "leaf-disease-q7wol/2",
        },
        timeout: 30000,
      });

      if (aiResponse?.data) {
        aiResult = aiResponse.data;
      }
    } catch (aiError) {
      console.error(
        "FastAPI call failed, using fallback:",
        aiError.response?.data || aiError.message
      );
    }

    const detection = await Detection.create({
      user: req.user.id,
      image: `/uploads/${req.file.filename}`,
      disease: aiResult.disease || "Unknown Disease",
      symptoms: aiResult.symptoms || "",
      recommendations: Array.isArray(aiResult.recommendations)
        ? aiResult.recommendations
        : [],
      confidence:
        typeof aiResult.confidence === "number" ? aiResult.confidence : 0,
      severity: aiResult.severity || "Low",
      cropType: aiResult.cropType || "Unknown Crop",
    });

    return res.status(201).json(detection);
  } catch (error) {
    console.error("Detection failed:", error);
    return res.status(500).json({ msg: "Detection failed" });
  }
};

exports.getMyDetections = async (req, res) => {
  try {
    const detections = await Detection.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    return res.json(detections);
  } catch (error) {
    console.error("Failed to fetch detection history:", error);
    return res.status(500).json({ msg: "Failed to fetch detection history" });
  }
};