const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  detectDisease,
  getMyDetections,
} = require("../controllers/cropController");
const authMiddleware = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/detect", authMiddleware, upload.single("image"), detectDisease);
router.get("/history", authMiddleware, getMyDetections);

module.exports = router;