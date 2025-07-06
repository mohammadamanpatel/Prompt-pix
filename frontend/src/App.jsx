import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Header } from "./pages/Header";
import Signin from "./pages/Signin";
import { Home } from "./pages/Home";
import SignUp from "./pages/Signup";
import ImageGeneration from "./components/ImageGenerate";
import GifGeneration from "./components/VideoGenerate";
import { Profile } from "./pages/Profile.jsx";
import { useSelector } from "react-redux";
import { About } from "./pages/About.jsx";
import { Settings } from "./components/Setting.jsx";
import AdminComponent from "./components/MyComponent.jsx";
import AdminDashboard from "./components/AdminDashBoard.jsx";

const App = () => {
  console.log("app is here");
  const currentUser = useSelector((state) => state.user.currentUser);
  console.log("currentUser in app", currentUser);
  // Function to check if the user is authenticated
  const isAuthenticated = currentUser && Object.keys(currentUser).length > 0;
  console.log("isAuthenticated", isAuthenticated);
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/sign-in" />}
        />
        <Route
          path="/settings"
          element={isAuthenticated ? <Settings /> : <Navigate to="/sign-in" />}
        />
        <Route
          path="/mycreation"
          element={
            isAuthenticated ? <AdminComponent /> : <Navigate to="/sign-in" />
          }
        />
        <Route
          path="/generateImage"
          element={
            isAuthenticated ? <ImageGeneration /> : <Navigate to="/sign-in" />
          }
        />
        <Route
          path="/generateVideo"
          element={
            isAuthenticated ? <GifGeneration /> : <Navigate to="/sign-in" />
          }
        />
        <Route
          path="/admin"
          element={
            currentUser && currentUser.message!== "token not found" && currentUser.user.isAdmin ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
