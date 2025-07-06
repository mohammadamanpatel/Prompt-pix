import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addImageGenerationData } from "../redux/user/adminSlice";

const ImageGeneration = () => {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("bad quality");
  const [width, setWidth] = useState("512");
  const [height, setHeight] = useState("512");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");

  const dispatch = useDispatch();

  const handleGenerateImage = async () => {
    if (!prompt) {
      setError("Prompt is required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/v1/generateImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, negativePrompt, width, height }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      setImage(data.imageUrl[0]);
    } catch (err) {
      setError(err.message || "Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveImage = async () => {
    if (!image) {
      setUploadError("No image to upload");
      return;
    }

    setUploading(true);
    setUploadError("");
    try {
      const response = await fetch("/api/v1/generateImage/uploadImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: image }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      console.log("data after posting media", data);

      // Dispatch the data to the Redux store
      dispatch(addImageGenerationData(data));

      alert(`Image saved`);
    } catch (err) {
      setUploadError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Generate an Image</h1>
      <div className="space-y-4">
        <InputField
          id="prompt"
          label="Enter a prompt"
          value={prompt}
          onChange={setPrompt}
          placeholder="Describe the image you want to generate"
        />
        <InputField
          id="negativePrompt"
          label="Negative prompt"
          value={negativePrompt}
          onChange={setNegativePrompt}
          placeholder="Describe what you don't want in the image"
        />
        <div className="flex space-x-4">
          <InputField
            id="width"
            label="Width"
            value={width}
            onChange={setWidth}
            type="number"
            min="64"
            max="1024"
          />
          <InputField
            id="height"
            label="Height"
            value={height}
            onChange={setHeight}
            type="number"
            min="64"
            max="1024"
          />
        </div>
      </div>
      <button
        onClick={handleGenerateImage}
        className="w-full mt-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>
      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      {image && (
        <>
          <div className="mt-6 flex justify-center">
            <img
              src={image}
              alt="Generated"
              className="max-w-full h-auto rounded-md shadow-lg"
            />
          </div>
          <button
            onClick={handleSaveImage}
            className="w-full mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
          >
            {uploading ? "Saving..." : "Save"}
          </button>
          {uploadError && (
            <p className="mt-4 text-red-500 text-center">{uploadError}</p>
          )}
        </>
      )}
    </div>
  );
};

const InputField = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  ...props
}) => (
  <div>
    <label
      className="block text-gray-700 text-sm font-semibold mb-2"
      htmlFor={id}
    >
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
      {...props}
    />
  </div>
);

export default ImageGeneration;
