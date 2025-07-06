import express from "express";
import generateImage from "../services/ImageGeneration.js";
import uploadImageToCloudinary from "../utils/uploadImageToCloudinary.js";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // Import this to define __dirname
import fetchImagesFromCloudinary from "../controllers/FetchImages.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("req.body", req.body);

  const { prompt, negativePrompt, width, height } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const generatedImage = await generateImage(
      prompt,
      negativePrompt,
      width,
      height
    ); 
    console.log("generatedImage", generatedImage);

    res.json({ imageUrl: generatedImage }); // Return the image URL
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/uploadImage", verifyToken, async (req, res) => {
  console.log("req.body", req.body);

  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  try {
    // Download the image from the URL
    const response = await axios({
      url: imageUrl,
      responseType: "arraybuffer",
    });
    console.log("response", response);

    // Ensure the 'uploads' directory exists
    const uploadsDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const tempImagePath = path.join(uploadsDir, `temp-${Date.now()}.png`);
    console.log("tempImagePath", tempImagePath);

    fs.writeFileSync(tempImagePath, response.data);

    // Upload the image to Cloudinary
    const cloudinaryResponse = await uploadImageToCloudinary(
      tempImagePath,
      "generated_images"
    );
    console.log("cloudinaryResponse", cloudinaryResponse);

    // Clean up the temporary file
    fs.unlinkSync(tempImagePath);

    res.json({
      cloudinaryUrl: cloudinaryResponse.secure_url,
      userId: req.user.id,
    });
  } catch (error) {
    console.log("error while uploading image", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/FetchImages", verifyToken, async (req, res) => {
  try {
    const images = await fetchImagesFromCloudinary();
    console.log("images", images);
    res.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

export default router;
