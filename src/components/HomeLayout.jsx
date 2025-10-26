import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";


const HomeLayout = ({ children, handleSearchClick }) => {
  const [localQuery, setLocalQuery] = useState("");
  return (
    <div>
      <div className="h-144">
        <div
          className="hm-page-container h-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
          style={{
            backgroundImage:
              "url('https://i.postimg.cc/pLCywZfz/pexels-pixabay-159711.jpg')",
          }}
        >
          <div className="text-center text-white p-8">
            <h2 className="text-[55px] text-shadow-outline">
              Find your next read!
            </h2>
            <div className="relative mt-4 w-80 mx-auto">
              <div className="flex items-center border border-gray-300 rounded-md">
                <input
                  type="text"
                  placeholder="Search for books..."
                  className="p-2 flex-grow text-black rounded-md pr-10"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)} // typing only
                />
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  onClick={() => handleSearchClick(localQuery)} 
                  className="text-gray-800 text-xl absolute right-3"
                />
              </div>
              <p className="text-[17px] mt-16 text-shadow-outline px-4 py-3 bg-black bg-opacity-50 rounded">
                <a className="text-[#EAD298]" href="/">
                  Sign up
                </a>{" "}
                or{" "}
                <a className="text-[#EAD298]" href="/registration">
                  {" "}
                  Log in{" "}
                </a>
                to access all features and join our community!
              </p>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default HomeLayout;
