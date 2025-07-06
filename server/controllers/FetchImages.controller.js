import { config } from "dotenv";
config();

const fetchImagesByFromCloudinary = async () => {
  const cloudName = process.env.CLOUD_NAME;
  const apiKey = process.env.API_KEY;
  const apiSecret = process.env.API_SECRET;

  const baseUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image`;

  try {
    const response = await fetch(baseUrl, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString(
          "base64"
        )}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! Status: ${response.status}. Response: ${errorText}`
      );
    }

    const data = await response.json();
    // console.log("data", data);

    // Filter images based on the substring of public_id
    const filteredImages = data.resources
      .filter((resource) => resource.public_id.startsWith("generated_"))
      .map((resource) => resource.secure_url);
    console.log("filtered media",filteredImages)
    return filteredImages;
  } catch (error) {
    console.error(`Error fetching images with substring ${substring}:`, error);
    return [];
  }
};

export default fetchImagesByFromCloudinary;
