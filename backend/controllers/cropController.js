const Detection = require("../models/Detection");

exports.detectDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "Image is required" });
    }

    const fakeResult = {
      disease: "Late Blight",
      symptoms: "Grayish-green elongated lesions on leaves with moisture-sensitive spread.",
      recommendations: [
        "Apply recommended fungicide",
        "Improve irrigation drainage",
        "Add potassium fertilizer",
      ],
      confidence: 92,
      severity: "High",
      cropType: "Tomato",
    };

    const detection = await Detection.create({
      user: req.user.id,
      image: `/uploads/${req.file.filename}`,
      disease: fakeResult.disease,
      symptoms: fakeResult.symptoms,
      recommendations: fakeResult.recommendations,
      confidence: fakeResult.confidence,
      severity: fakeResult.severity,
      cropType: fakeResult.cropType,
    });

    res.status(201).json(detection);
  } catch (error) {
    console.error("Detection failed:", error);
    res.status(500).json({ msg: "Detection failed" });
  }
};

exports.getMyDetections = async (req, res) => {
  try {
    const detections = await Detection.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(detections);
  } catch (error) {
    console.error("Failed to fetch detection history:", error);
    res.status(500).json({ msg: "Failed to fetch detection history" });
  }
};