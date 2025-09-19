import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Logo from "../assets/images/bookbuddy.png";

const Header = ({ isLoggedIn }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-[#EAD298] relative text-white px-2 py-2 md:px-4 md:py-2">
        <div className="flex justify-between items-center w-full">
          {/* Mobile Hamburger - Left */}
          <div className="md:hidden flex-shrink-0 mt-2">
            <button
              className="text-2xl text-[#A83D3D]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <FaBars />
            </button>
          </div>

          {/* Logo - Center on mobile, left on desktop */}
          <div className="flex-1 flex justify-center md:justify-start">
            <Link to="/">
              <img src={Logo} className="h-7 md:h-9" alt="book-logo" />
            </Link>
          </div>

          {/* Desktop Menu - Hidden on mobile */}
          <div className="hidden md:flex items-center ml-auto justify-between">
            <nav>
              {isLoggedIn ? (
                <ul className="flex gap-4 text-white text-lg">
                  <li>
                    <Link to="/dashboard" className="hover:text-[#9B2D2D]">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="hover:text-[#9B2D2D]">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/logout" className="hover:text-[#9B2D2D]">
                      Logout
                    </Link>
                  </li>
                </ul>
              ) : (
                <ul className="flex gap-4 text-white text-lg">
                  <li>
                    <Link to="/home" className="text-[#A83D3D] hover:text-yellow-400">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="text-[#A83D3D] hover:text-yellow-400">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/registration" className="text-[#A83D3D] hover:text-yellow-400">
                      Register
                    </Link>
                  </li>
                </ul>
              )}
            </nav>
          </div>
        </div>

        {/* Mobile Menu - Hidden on desktop */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md z-50">
            <ul className="flex flex-col gap-2 p-4">
              {isLoggedIn ? (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      className="block text-black hover:text-[#9B2D2D]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="block text-black hover:text-[#9B2D2D]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/logout"
                      className="block text-black hover:text-[#9B2D2D]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Logout
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/home"
                      className="block text-black hover:text-[#A83D3D]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      className="block text-black hover:text-[#A83D3D]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/registration"
                      className="block text-black hover:text-[#A83D3D]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;