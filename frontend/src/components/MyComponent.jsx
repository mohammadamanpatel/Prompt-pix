import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import PreviewModal from "./PreviewModal";

// Register the chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [validImages, setValidImages] = useState([]);
  const [validGifs, setValidGifs] = useState([]);
  const [previewImage, setPreviewImage] = useState(null); // State for preview image
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const imageGenerationData = useSelector(
    (state) => state.admindata.imageGenerationData
  );

  const gifGenerationData = useSelector(
    (state) => state.admindata.gifGenerationData
  );

  // Utility function to check if a URL is valid
  const checkUrl = async (url) => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // Filter valid URLs
  const filterValidUrls = async (data) => {
    console.log("data",data)
    const validData = [];
    for (const item of data) {
      console.log("item",item)
      const isValid = await checkUrl(item.cloudinaryUrl);
      if (isValid) {
        validData.push(item);
      }
    }
    return validData;
  };

  useEffect(() => {
    // Filter valid images and GIFs
    const fetchValidData = async () => {
      const validImageUrls = await filterValidUrls(imageGenerationData);
      const validGifUrls = await filterValidUrls(gifGenerationData);
      setValidImages(validImageUrls);
      setValidGifs(validGifUrls);
    };

    fetchValidData();
  }, [imageGenerationData, gifGenerationData]);

  // Process data for the charts
  const processData = (data) => {
    const userMap = data.reduce((acc, item) => {
      acc[item.userId] = (acc[item.userId] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(userMap),
      datasets: [
        {
          label: "Count",
          data: Object.values(userMap),
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)", // Red
            "rgba(54, 162, 235, 0.6)", // Blue
          ],
          borderColor: [
            "rgba(255, 99, 132, 2)",
            "rgba(54, 162, 235, 2)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const imageChartData = processData(imageGenerationData);
  const gifChartData = processData(gifGenerationData);

  const handleImageClick = (imageUrl) => {
    setPreviewImage(imageUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPreviewImage(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">My Usage</h1>

      {/* Image Generation Chart */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Image Generation Data</h2>
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-md">
            <Pie
              data={imageChartData}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Image Generation by User",
                  },
                  legend: {
                    display: true,
                    position: "top",
                  },
                },
              }}
            />
          </div>
        </div>
      </section>

      {/* GIF Generation Chart */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">GIF Generation Data</h2>
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-md">
            <Pie
              data={gifChartData}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "GIF Generation by User",
                  },
                  legend: {
                    display: true,
                    position: "top",
                  },
                },
              }}
            />
          </div>
        </div>
      </section>

      {/* My Creations Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">My Creations</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {validImages.map((creation) => (
            <div
              key={creation._id}
              className="border p-4 rounded-lg shadow-lg transform transition duration-300 hover:scale-105"
              onClick={() => handleImageClick(creation.cloudinaryUrl)}
            >
              <img
                src={creation.cloudinaryUrl}
                alt={creation.title || "My Image Creation"}
                className="w-full h-48 object-cover rounded"
              />
            </div>
          ))}
          {validGifs.map((creation) => (
            <div
              key={creation._id}
              className="border p-4 rounded-lg shadow-lg transform transition duration-300 hover:scale-105"
              onClick={() => handleImageClick(creation.cloudinaryUrl)}
            >
              <img
                src={creation.cloudinaryUrl}
                alt={creation.title || "My GIF Creation"}
                className="w-full h-48 object-cover rounded"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Preview Modal */}
      <PreviewModal show={isModalOpen} onClose={handleCloseModal} imageUrl={previewImage} />
    </div>
  );
};

export default Dashboard;
