import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess } from "../redux/user/userSlice";

export const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const handleEditProfile = () => {
    navigate("/profile"); // Adjust the route as needed
  };

  const handleDeleteAccount = async () => {
    dispatch(deleteUserStart())
    try {
      const res = await fetch(`/api/v1/userRoutes/delete/${currentUser.user._id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.error) {
        console.log("Error deleting user:", result.error);
        return;
      }
      else{
        dispatch(deleteUserSuccess(currentUser));
        navigate("/sign-in")
      }
    } catch (error) {
      dispatch(deleteUserFailure(error));
      console.log("Error in user deletion:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-indigo-500">
          Account Settings
        </h1>

        {/* Profile Edit Section */}
        <div className="bg-gray-800 p-5 sm:p-6 rounded-lg shadow-lg mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <p className="text-lg sm:text-xl font-semibold">
                {currentUser.user.username}
              </p>
              <p className="text-sm sm:text-base text-gray-400">
                {currentUser.user.email}
              </p>
            </div>
            <button
              onClick={handleEditProfile}
              className="bg-indigo-600 hover:bg-indigo-700 transition-all ease-in-out duration-300 px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Account Deletion Section */}
        <div className="bg-gray-800 p-5 sm:p-6 rounded-lg shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <p className="text-lg sm:text-xl font-semibold">Delete Account</p>
              <p className="text-sm sm:text-base text-gray-400">
                Permanently delete your account
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700 transition-all ease-in-out duration-300 px-4 py-2 rounded"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
