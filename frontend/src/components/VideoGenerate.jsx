import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addGifGenerationData } from "../redux/user/adminSlice.js"; // Adjust the import path as needed

const GifGeneration = () => {
  const [prompt, setPrompt] = useState("");
  const [gifUrl, setGifUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const dispatch = useDispatch();

  const handleGenerateGif = async () => {
    if (!prompt) {
      setError("Prompt is required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/v1/generateVideo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          output_type: "gif",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate GIF");
      }

      const data = await response.json();
      setGifUrl(data.videoUrl);
    } catch (err) {
      setError(err.message || "Failed to generate GIF");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGif = async () => {
    if (!gifUrl) {
      setUploadError("No GIF to upload");
      return;
    }

    setUploading(true);
    setUploadError("");
    try {
      const response = await fetch("/api/v1/generateVideo/uploadVideo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl: gifUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload GIF");
      }

      const data = await response.json();
      
      // Dispatch data to Redux store
      dispatch(addGifGenerationData(data));
      
      alert(`GIF saved`);
    } catch (err) {
      setUploadError(err.message || "Failed to upload GIF");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Generate a GIF</h1>
      <div className="space-y-4">
        <InputField
          id="prompt"
          label="Enter a prompt"
          value={prompt}
          onChange={setPrompt}
          placeholder="Describe the GIF you want to generate"
        />
      </div>
      <button
        onClick={handleGenerateGif}
        disabled={loading}
        className="w-full mt-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 disabled:bg-blue-300"
      >
        {loading ? "Generating..." : "Generate GIF"}
      </button>
      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      {gifUrl && (
        <>
          <div className="mt-6 flex justify-center">
            <img
              src={gifUrl}
              alt="Generated GIF"
              className="max-w-full h-auto rounded-md shadow-lg"
            />
          </div>
          <button
            onClick={handleSaveGif}
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
  as = "input",
  type = "text",
  children,
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

export default GifGeneration;
