import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import Logo from "../assets/images/bookbuddy.png";
import Usericon from "../assets/images/user.png"; // Import the default user icon

const HeaderLoggedIn = ({ user, onLogout, updateUser }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to toggle the dropdown menu
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Handle logout
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // Handle profile picture change
  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/uploadProfilePicture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update the user's photoURL in the frontend
      if (response.data.user) {
        updateUser(response.data.user);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  return (
    <header className="bg-[#EAD298] text-white p-4 flex justify-between items-center">
      <Link to = "/logedin-home">
      <img src={Logo} className="h-9" alt="book-logo" />
      </Link>
      <nav className="flex items-center">
        <ul className="flex gap-4">
          <li>
            <Link to="/mylibrary" className="hover:text-yellow-400">
              My Books
            </Link>
          </li>
          <li>
            <Link to="/discover" className="hover:text-yellow-400">
              Discover
            </Link>
          </li>
        </ul>
        <div className="relative ml-4">
          <button onClick={toggleDropdown} className="flex items-center gap-2">
            <img
              src={user?.photoURL || Usericon} 
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-4 bg-white text-black rounded shadow-lg w-40">
              <ul>
                <li>
                  <label className="block px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer">
                    Change Profile Picture
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureChange}
                    />
                  </label>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-200"
                  >
                    Edit Profile
                  </Link>
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
      </nav>
    </header>
  );
};

export default HeaderLoggedIn;