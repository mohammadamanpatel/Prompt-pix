import axios from "axios";
import { config } from "dotenv";
config();
const GIPHY_API_KEY = process.env.GIPHY_API_KEY;
const generateVideo = async (prompt) => {
  try {
    const tagurl = `https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_API_KEY}&tag=${prompt}`;

    if (!GIPHY_API_KEY || !tagurl) {
      throw new Error("API key or endpoint not configured");
    }

    const { data } = await axios.get(tagurl);
    console.log(data);
    const Source = data.data.images.downsized_large.url;
    console.log("Source ==> " , Source.split('?')[0]);
    return Source.split('?')[0];
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export default generateVideo;
