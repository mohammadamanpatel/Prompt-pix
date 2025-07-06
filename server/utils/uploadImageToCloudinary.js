import cloudinary from 'cloudinary';

async function uploadMediaToCloudinary(filePath, folder, height, width, gravity, crop) {
  console.log("file in uploadMediaToCloudinary =>", filePath);
  
  const options = {
    folder,
    resource_type: "auto", // Automatically detect the resource type (image, video, etc.)
  };

  if (height) {
    options.height = height;
  }
  if (width) {
    options.width = width;
  }
  if (gravity) {
    options.gravity = gravity;
  }
  if (crop) {
    options.crop = crop;
  }

  try {
    const result = await cloudinary.v2.uploader.upload(filePath, options);
    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload media to Cloudinary");
  }
}

export default uploadMediaToCloudinary;
