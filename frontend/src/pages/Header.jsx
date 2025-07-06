import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import headerLogo from "../../assests/HeaderLogo/Logo.png";
export const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false); // State for navigation visibility
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    // Redirect to sign-in only if the user is not on the sign-up page
    if (!currentUser && location.pathname !== "/sign-up") {
      navigate("/sign-in");
    }
  }, [currentUser, navigate, location.pathname]);
  // Hide the signup link when the user is logged in
  const renderAuthLinks = () => {
    if (currentUser) {
      return null;
    } else {
      return (
        <Link
          className="font-medium text-gray-300 hover:text-white focus:outline-none focus:text-white"
          to="/sign-up"
        >
          Signup
        </Link>
      );
    }
  };

  const handleAvatarClick = (event) => {
    event.stopPropagation();
    setIsModalOpen(!isModalOpen);
  };
  async function handleSignOut() {
    console.log("hiii logout complete");
    dispatch(signOutUserStart());
    try {
      const response = await fetch("/api/v1/auth/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }
      dispatch(signOutUserSuccess(currentUser));
      navigate("/sign-in");
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }
  return (
    <div className="relative space-y-4 bg-custom-cream">
      {/* Primary Navigation */}
      <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full text-sm py-3">
        <nav className="max-w-[85rem] w-full mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <Link className="flex-none" to="/">
              <img
                src={headerLogo}
                alt="Brand Logo"
                className="h-40 w-auto sm:h-16 sm:w-auto" // Increase the height and width
              />
            </Link>
            <div className="sm:hidden">
              <button
                type="button"
                className="relative flex justify-center items-center gap-2 rounded-lg border border-white/20 font-medium bg-blue-600 text-white shadow-sm align-middle hover:bg-white/10 focus:outline-none focus:bg-white/10 text-sm"
                onClick={() => setIsNavOpen(!isNavOpen)}
              >
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" x2="21" y1="6" y2="6" />
                  <line x1="3" x2="21" y1="12" y2="12" />
                  <line x1="3" x2="21" y1="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center sm:justify-end">
            <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
              <Link
                className="font-medium text-gray-300 hover:text-gray-600 focus:outline-none"
                to="/"
                aria-current="page"
              >
                Home
              </Link>
              <Link
                className="font-medium text-gray-300 hover:text-gray-600 focus:outline-none focus:text-white"
                to="/About"
              >
                About
              </Link>
              {renderAuthLinks()}
              {currentUser && (
                <div className="relative">
                  <img
                    src={currentUser &&  currentUser.message!== "token not found" && currentUser.user.avatar.secure_url}
                    alt="User Avatar"
                    className="h-8 w-8 rounded-full cursor-pointer"
                    onClick={handleAvatarClick}
                  />
                  {isModalOpen && (
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-md shadow-lg w-48 z-30">
                      <div className="flex flex-col">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsModalOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsModalOpen(false)}
                        >
                          Settings
                        </Link>
                        <Link
                          to="/generateImage"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsNavOpen(false)}
                        >
                          Image Generation
                        </Link>
                        <Link
                          to="/generateVideo"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsNavOpen(false)}
                        >
                          Gif Generation
                        </Link>
                        <Link
                          to="/mycreation"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsNavOpen(false)}
                        >
                          Creations
                        </Link>
                        {currentUser && currentUser.user.isAdmin && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsNavOpen(false)}
                          >
                            Admin section
                          </Link>
                        )}
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            handleSignOut();
                            setIsNavOpen(false);
                            setIsModalOpen(false);
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Modal for Navigation Links on Small Screens */}
      {isNavOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-30 bg-black bg-opacity-50 sm:hidden"
          onClick={() => setIsNavOpen(false)}
        >
          <div
            className="relative bg-white rounded-lg shadow-lg w-72 sm:w-80"
            onClick={(e) => e.stopPropagation()} // Prevent click events inside the modal from closing it
          >
            <div className="p-4">
              <Link
                to="/"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsNavOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/About"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsNavOpen(false)}
              >
                About
              </Link>
              {renderAuthLinks()}
              {currentUser && (
                <div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Settings
                  </Link>
                  <Link
                    to="/generateImage"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Image Generation
                  </Link>
                  <Link
                    to="/generateVideo"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Gif Generation
                  </Link>
                  <Link
                    to="/mycreation"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsNavOpen(false)}
                  >
                    My Creation
                  </Link>
                  {currentUser && currentUser.user.isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsNavOpen(false)}
                    >
                      Admin section
                    </Link>
                  )}
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      handleSignOut();
                      setIsNavOpen(false);
                      setIsModalOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
