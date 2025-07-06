const fetchMediaFromCloudinary = async () => {
  try {
    const response = await fetch("/api/v1/generateImage/FetchImages");
    console.log("response",response)
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("data",data)
    console.log("data in image fetch", data);

    return data; // Assuming the API returns an array of image URLs
  } catch (error) {
    console.log("Error fetching images:", error);
    throw new Error("Failed to fetch images from the server");
  }
};

export default fetchMediaFromCloudinary;
