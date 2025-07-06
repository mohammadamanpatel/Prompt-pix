import React, { useEffect, useState } from "react";
import fetchMediaFromCloudinary from "../utils/ImageFetcher";
import "./Home.css"; // Import the custom CSS for the animation
import { useSelector } from "react-redux";

export const Home = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUser = useSelector((state)=>state.user.currentUser)
  console.log("currentUser in home.jsx",currentUser);
  
  useEffect(() => {
    const loadImages = async () => {
      try {
        const fetchedImages = await fetchMediaFromCloudinary();
        setImages(fetchedImages);
      } catch (err) {
        setError("Failed to load images");
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
    <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
        </div>
    </div>
</div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto px-5 py-2 lg:px-32 lg:pt-24 bg-gray-900 text-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold animate-slide-in">
          Welcome to PromptPix
        </h1>
        <p className="text-lg mt-2 animate-slide-in-delay">
          Discover a world of AI-generated images, curated just for you!
        </p>
      </div>
      <div className="-m-1 flex flex-wrap md:-m-2">
        <div className="flex w-1/2 flex-wrap">
          {images.length > 0 && images.slice(0, 2).map((image, index) => (
            <div key={index} className="w-1/2 p-1 md:p-2">
              <img
                src={image}
                alt={`Cloudinary Image ${index}`}
                className="block h-full w-full rounded-lg object-cover object-center"
              />
            </div>
          ))}
          {images.length > 0 && images.length > 2 && (
            <div className="w-full p-1 md:p-2">
              <img
                src={images[2]}
                alt={`Cloudinary Image 2`}
                className="block h-full w-full rounded-lg object-cover object-center"
              />
            </div>
          )}
        </div>
        <div className="flex w-1/2 flex-wrap">
          {images.length > 0 && images.length > 3 && (
            <div className="w-full p-1 md:p-2">
              <img
                src={images[3]}
                alt={`Cloudinary Image 3`}
                className="block h-full w-full rounded-lg object-cover object-center"
              />
            </div>
          )}
          {images.length > 0 && images.slice(4, 6).map((image, index) => (
            <div key={index} className="w-1/2 p-1 md:p-2">
              <img
                src={image}
                alt={`Cloudinary Image ${index}`}
                className="block h-full w-full rounded-lg object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
