import React from "react";

const Footer = () => {
    return (
  
    
      <footer className=" bg-[#EAD298]   text-[#A83D3D]  py-6">
        <div className="container mx-auto flex flex-wrap justify-between">
          {/* Section for app info */}
          <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
            <h3 className="text-xl font-semibold">Book Buddy</h3>
            <p className="text-sm mt-2">Your Personal Book Recommendation App</p>
          </div>
  
          {/* Section for links */}
          <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="text-sm">
              <li><a href="#home" className="hover:underline">Home</a></li>
              <li><a href="#library" className="hover:underline">Library</a></li>
              <li><a href="#search" className="hover:underline">Search</a></li>
              <li><a href="#about" className="hover:underline">About</a></li>
            </ul>
          </div>
  
          {/* Section for social media */}
          <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
            <h3 className="text-xl font-semibold">Follow Us</h3>
            <div className="flex space-x-4 mt-2">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400">
                Instagram
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400">
                Facebook
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400">
                Twitter
              </a>
            </div>
          </div>
        </div>
  
        {/* Bottom copyright */}
        <div className="  mt-6 text-center text-sm text-white">
          <p>&copy; {new Date().getFullYear()} Book Buddy. All rights reserved.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  
