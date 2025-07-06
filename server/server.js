import express from "express";
import { config } from "dotenv";
config();
const app = express();
import DBConnection from "./config/DBConnection.js";
import cookieparser from "cookie-parser";
import { v2 } from "cloudinary";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import generateImageRoute from "./routes/imageGenerate.route.js"
import generateVideoRoute from "./routes/videoGeneration.route.js"
import userRoutes from "./routes/user.route.js";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(cors());
// Start server
const PORT = process.env.PORT || 5000;
console.log("process.env.CLOUD_NAME", process.env.CLOUD_NAME);
console.log("process.env.API_KEY", process.env.API_KEY);
console.log("process.env.API_SECRET", process.env.API_SECRET);
v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
app.listen(PORT, async () => {
  console.log("Database connected");
  await DBConnection();
  console.log(`Server running on port ${PORT}`);
});
app.use("/api/v1/auth", authRoutes);
app.use('/api/v1/generateImage', generateImageRoute);
app.use('/api/v1/generateVideo', generateVideoRoute);
app.use('/api/v1/userRoutes', userRoutes);
