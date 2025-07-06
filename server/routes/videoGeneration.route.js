import express from "express";
import generateVideo from "../services/VideoGeneration.js";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // Import this to define __dirname
import uploadImageToCloudinary from "../utils/uploadImageToCloudinary.js";
import { verifyToken } from "../middlewares/verifyToken.js";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Video generation route
router.post("/", async (req, res) => {
  console.log("req.body", req.body);

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const generatedVideo = await generateVideo(prompt);
    console.log("generatedVideo", generatedVideo);

    res.json({ videoUrl: generatedVideo }); // Return the video URL
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Video upload route
const fetchedDataForAdmin = {};
router.post("/uploadVideo", verifyToken, async (req, res) => {
  console.log("req.user", req.user);

  console.log("req.body", req.body);

  const { videoUrl } = req.body;
  console.log("videoUrl", videoUrl);

  if (!videoUrl) {
    return res.status(400).json({ error: "Video URL is required" });
  }

  if (typeof videoUrl !== "string") {
    return res.status(400).json({ error: "Video URL must be a string" });
  }

  try {
    // Download the video from the URL
    const response = await axios({
      url: videoUrl,
      responseType: "arraybuffer",
    });
    console.log("response", response);

    // Ensure the 'uploads' directory exists
    const uploadsDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    // Determine the file extension based on the video URL
    const fileExtension = videoUrl.toLowerCase().endsWith(".gif")
      ? ".gif"
      : ".mp4";
    const tempVideoPath = path.join(
      uploadsDir,
      `temp-${Date.now()}${fileExtension}`
    );
    console.log("tempVideoPath", tempVideoPath);

    fs.writeFileSync(tempVideoPath, response.data);

    // Upload the video to Cloudinary
    const cloudinaryResponse = await uploadImageToCloudinary(
      tempVideoPath,
      "generated_videos"
    );
    console.log("cloudinaryResponse", cloudinaryResponse);
    fetchedDataForAdmin.cloudinaryResponse = cloudinaryResponse.secure_url;
    fetchedDataForAdmin.userId = req.user.id;
    console.log("fetchedDataForAdmin ---> ", fetchedDataForAdmin);
    // Clean up the temporary file
    fs.unlinkSync(tempVideoPath);

    // Send the Cloudinary URL as the response
    res.json({
      cloudinaryUrl: cloudinaryResponse.secure_url,
      userId: req.user.id,
    });
  } catch (error) {
    console.log("error while uploading video", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
