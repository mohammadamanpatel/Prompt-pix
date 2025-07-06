import axios from "axios";
import { config } from "dotenv";
config();

console.log(
  "process.env.STABLE_DIFFUSION_API_KEY",
  process.env.STABLE_DIFFUSION_API_KEY
);
console.log(
  "process.env.STABLE_DIFFUSION_API_ENDPOINT_IMAGE",
  process.env.STABLE_DIFFUSION_API_ENDPOINT_IMAGE
);

const generateImage = async (prompt, negativePrompt, width, height) => {
  try {
    const apiKey = process.env.STABLE_DIFFUSION_API_KEY;
    const apiEndpoint = process.env.STABLE_DIFFUSION_API_ENDPOINT_IMAGE;

    if (!apiKey || !apiEndpoint) {
      throw new Error("API key or endpoint not configured");
    }

    const response = await axios.post(
      apiEndpoint,
      {
        key: apiKey,
        prompt,
        negative_prompt: negativePrompt,
        width,
        height,
        safety_checker: false,
        samples: 1,
        base64: false,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("response", response);
    return response.data.output;
  } catch (error) {
    console.log("error", error);
  }
};

export default generateImage;
