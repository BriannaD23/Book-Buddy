import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/images/bookbuddy.png";
import Usericon from "../assets/images/user.png";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  updateProfilePic,
  getUserProfile,
  updateName,
} from "../services/userService.js";

const HeaderLoggedIn = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [tempName, setTempName] = useState(user?.name || "");
  const [tempProfilePic, setTempProfilePic] = useState(Usericon);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const handleProfilePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Image = reader.result;
        setTempProfilePic(base64Image);
      };
    }
  };

  const saveProfile = async () => {
    try {
      await updateProfilePic(user._id, tempProfilePic);
      setUser({ ...user, photoURL: tempProfilePic });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const saveName = async () => {
    try {
      await updateName(user._id, tempName);
      setUser({ ...user, name: tempName });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error updating name:", err);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
        setTempProfilePic(userData?.photoURL || Usericon);
        setTempName(userData?.name || "");
      } catch (err) {
        console.error(err.message);
      }
    };
    loadProfile();
  }, []);
  return (
    <>
      <header className="bg-[#EAD298] relative text-white px-2 py-2 md:px-4 md:py-2 relative ">
        <div className="flex justify-between items-center  w-full">
          <div className=" md:hidden flex-shrink-0 mt-2">
            {/* Mobile Hamburger - left */}
            <button
              className="text-2xl text-[#A83D3D]"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsDropdownOpen(false);
              }}
            >
              <FaBars />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 flex justify-center md:justify-start">
            <Link to="/logedin-home">
              <img src={Logo} className="h-7 ml-0 m:h-9" alt="book-logo" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center ml-auto justify-between ">
            <ul className="flex gap-12 text-white text-lg ml-auto ">
              <li>
                <Link to="/logedin-home" className="hover:text-[#9B2D2D]">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/mylibrary" className="hover:text-[#9B2D2D]">
                  My Books
                </Link>
              </li>
              <li>
                <Link to="/discoverpage" className="hover:text-[#9B2D2D]">
                  Discover
                </Link>
              </li>
            </ul>
          </div>

          {/* Profile Icon - Right */}
          <div className="ml-6">
            <button
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2"
            >
              <img
                src={user?.photoURL || Usericon}
                alt="Profile"
                className="w-10 h-10   rounded-full object-cover border-2 border-black"
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded  rounded-tr-none shadow-lg w-40 z-5 ">

                <ul>

              <div className="mb-4">
                <button
                      onClick={() =>  setIsDropdownOpen(false)} // or your close handler
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 "
                      aria-label="Close"
                    >
                      <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                  </div>
                  <li>
                   
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
                      onClick={() => setIsModalOpen(true)}
                    >
                      My Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md z-50">
            <ul className="flex flex-col gap-2 p-4">
              <li>
                <Link
                  to="/logedin-home"
                  className="block text-black hover:text-[#9B2D2D]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/mylibrary"
                  className="block text-black hover:text-[#9B2D2D]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Books
                </Link>
              </li>
              <li>
                <Link
                  to="/discoverpage"
                  className="block text-black hover:text-[#9B2D2D]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Discover
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-lg font-bold mb-4">Edit Profile</h2>

            <div className="flex flex-col items-center mb-4  mr-10">
              <img
                src={tempProfilePic}
                alt="Profile"
                className="w-40 h-40 rounded-full mb-2 object-cover"
              />
              <label className="cursor-pointer text-blue-500 mb-2">
                Change Profile Pic
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </label>
            </div>

            <input
              type="text"
              placeholder="Enter your name"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  saveProfile();
                  saveName();
                }}
              >
                Save
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderLoggedIn;
