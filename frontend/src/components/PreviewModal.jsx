import React from "react";

const PreviewModal = ({ show, onClose, imageUrl }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="relative">
        <button
          className="absolute top-0 right-0 m-4 text-white text-3xl"
          onClick={onClose}
        >
          &times;
        </button>
        <img
          src={imageUrl}
          alt="Preview"
          className="max-w-full max-h-screen object-contain"
        />
      </div>
    </div>
  );
};

export default PreviewModal;
