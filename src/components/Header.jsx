import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/images/bookbuddy.png";

const Header = ({ isLoggedIn }) => {
  return (
    <header className="bg-[#EAD298] text-white p-4 flex justify-between items-center">
        <img src={Logo} className="h-9" alt="book-logo" />
      <nav>
        {isLoggedIn ? (
          <ul className="flex gap-4">
            <li>
              <Link to="/dashboard" className= "hover:text-[#9B2D2D]">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/profile" className= "hover:text-[#9B2D2D]">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/logout" className= "hover:text-[#9B2D2D]">
                Logout
              </Link>
            </li>
          </ul>
        ) : (
          <ul className="flex gap-4">
            <li>
              <Link to="/home" className="text-[#A83D3D] hover:text-yellow-400">
                Home
              </Link>
            </li>
            <li>
              <Link to="/login" className="text-[#A83D3D] hover:text-yellow-400">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="text-[#A83D3D] hover:text-yellow-400">
                Register
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Header;
