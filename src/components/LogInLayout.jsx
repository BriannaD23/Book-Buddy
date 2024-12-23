import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const CommonLayout = ({ children, searchQuery, handleSearchChange }) => {
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
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="text-gray-800 text-xl absolute right-3 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default CommonLayout;