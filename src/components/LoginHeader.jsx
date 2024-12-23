// src/components/HeaderLoggedIn.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/images/bookbuddy.png";

const HeaderLoggedIn = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to toggle the dropdown menu
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Handle logout
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="bg-[#EAD298] text-white p-4 flex justify-between items-center">
      <img src={Logo} className="h-9" alt="book-logo" />
      <nav className="flex items-center">
        <ul className="flex gap-4">
          <li>
            <Link to="/mylibrary" className="hover:text-yellow-400">
             My Books
            </Link>
          </li>
          <li>
            <Link to="/profile" className="hover:text-yellow-400">
              Discover
            </Link>
          </li>
        </ul>
        <div className="relative ml-4">
          <button onClick={toggleDropdown} className="flex items-center gap-2">
            <img
              src={user?.photoURL || "/path/to/default-avatar.png"} // Display the user's photo or a default image
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-4 bg-white text-black rounded shadow-lg w-40">
              <ul>
                <li>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-200"
                  >
                    Change Profile Picture
                  </Link>
                </li>
                <li>
                <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
                  >
                    Edit Profile
                  </button>
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
