import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsPersonCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice.js";

export const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);

  const [data, setData] = useState({
    username: currentUser.user.username || "",
    email: currentUser.user.email || "",
    previewImage: currentUser.user.avatar.secure_url || "",
    avatar: "",
    userId: currentUser.user._id,
  });

  function handleImageUpload(e) {
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", () => {
        setData({
          ...data,
          previewImage: fileReader.result,
          avatar: uploadedImage,
        });
      });
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    if (!data.username || !data.email) {
      return;
    }

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("avatar", data.avatar);

    try {
      dispatch(updateUserStart());
      const res = await fetch(
        `/api/v1/userRoutes/update/${currentUser.user._id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await res.json();
      if (result.error) {
        dispatch(updateUserFailure(result.error));
        return;
      }

      dispatch(updateUserSuccess(result));
      navigate("/profile");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  return (
    <div className="flex flex-col w-full lg:w-1/2 xl:w-1/3 mx-auto  p-8 rounded-lg shadow-lg text-white mb-8">
      <form onSubmit={onFormSubmit} className="flex flex-col gap-6">
        <h1 className="text-center text-3xl text-black font-bold mb-4">Edit Profile</h1>
        <label className="cursor-pointer mx-auto" htmlFor="image_uploads">
          {data.previewImage ? (
            <img
              src={data.previewImage}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-700 shadow-lg"
              alt="Profile"
            />
          ) : (
            <BsPersonCircle className="w-32 h-32 text-gray-500" />
          )}
        </label>
        <input
          type="file"
          onChange={handleImageUpload}
          id="image_uploads"
          name="image_uploads"
          accept=".jpg, .png, .jpeg, .svg"
          className="hidden"
        />
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="font-semibold text-gray-400" htmlFor="username">
              Username
            </label>
            <input
              required
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={data.username}
              className="bg-gray-800 px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-gray-400" htmlFor="email">
              Email
            </label>
            <input
              required
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={data.email}
              className="bg-gray-800 px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 rounded-md py-2 text-lg font-medium"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};
