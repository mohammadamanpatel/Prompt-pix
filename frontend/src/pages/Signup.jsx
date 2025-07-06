import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth.jsx"; // Import the OAuth component

const SignUp = () => {
  console.log("signup");

  const [signupDetails, setSignupDetails] = useState({
    email: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  function handleUserInput(event) {
    const { name, value } = event.target;
    setSignupDetails({
      ...signupDetails,
      [name]: value,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();

    if (
      !signupDetails.email ||
      !signupDetails.password ||
      !signupDetails.username
    ) {
      alert("Please fill all the details");
      return;
    }

    try {
      const response = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupDetails),
      });

      if (response.ok) {
        setSignupDetails({
          email: "",
          username: "",
          password: "",
        });
        navigate("/sign-in");
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error creating account:", error);
      alert(error.message || "Failed to create account");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="mx-auto flex w-full max-w-lg flex-col rounded-xl border border-border bg-white p-8 sm:p-10 md:p-16">
        <div className="mb-6 text-center text-2xl font-bold text-gray-800">
          Create Account
        </div>
        <OAuth /> {/* Insert OAuth component here */}
        <form onSubmit={onFormSubmit} className="mt-6">
          <div className="flex flex-col gap-4">
            <div>
              <input
                type="email"
                name="email"
                value={signupDetails.email}
                onChange={handleUserInput}
                placeholder="Email"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <input
                type="text"
                name="username"
                value={signupDetails.username}
                onChange={handleUserInput}
                placeholder="Username"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={signupDetails.password}
                onChange={handleUserInput}
                placeholder="Password"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 mt-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
            >
              Create Account
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-indigo-600 hover:text-indigo-800">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
