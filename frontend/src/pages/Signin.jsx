import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const Signin = () => {
  const [signInDetails, setSignInDetails] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUserInput = (event) => {
    const { name, value } = event.target;
    setSignInDetails({
      ...signInDetails,
      [name]: value,
    });
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();

    if (!signInDetails.email || !signInDetails.password) {
      alert("Please fill all the details");
      return;
    }

    try {
      dispatch(signInStart());
      const response = await fetch("/api/v1/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signInDetails),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data) {
        dispatch(signInSuccess(data));
        alert("Logged in successfully!");
        setSignInDetails({
          email: "",
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure());
      console.error("Error signing in:", error);
      alert(error.message || "Failed to sign in");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        noValidate
        onSubmit={onFormSubmit}
        className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-gray-300"
      >
        <div className="mb-6 text-center text-2xl font-bold text-gray-800">
          Sign in
        </div>

        <div className="mb-6">
          <OAuth />
        </div>
        <div className="text-center text-sm text-gray-600 mb-4">
          or continue with
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            placeholder="Type here"
            type="email"
            name="email"
            value={signInDetails.email}
            onChange={handleUserInput}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            placeholder="Type here"
            type="password"
            name="password"
            value={signInDetails.password}
            onChange={handleUserInput}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Sign in
        </button>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signin;
