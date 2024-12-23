import React, { useEffect, useState } from "react";
import BookList from "../components/Booklist.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const Home = ({ isLoggedIn }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [startIndex, setStartIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const resultsPerPage = 16; 

  const defaultCategory = "Fiction"; 

  const fetchBooks = async () => {
    setLoading(true);
    const query = searchQuery || defaultCategory; 
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${resultsPerPage}&orderBy=relevance`
      );
      const data = await response.json();
      setBooks(data.items || []);
      setTotalItems(data.totalItems || 0);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetchBooks when the component mounts or searchQuery/startIndex changes
  useEffect(() => {
    setBooks([]); 
    fetchBooks();
  }, [searchQuery, startIndex]);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setStartIndex(0); 
  };

  // Handle pagination (Next and Previous)
  const handleNextPage = () => {
    setStartIndex(startIndex + resultsPerPage);
  };

  const handlePrevPage = () => {
    setStartIndex(Math.max(startIndex - resultsPerPage, 0)); // Prevent going negative
  };


  return (
    <div>
      <main>
        {isLoggedIn ? (
          <div>
            <h2>Welcome Back, User!</h2>
            <p>Your personalized content goes here.</p>
          </div>
        ) : (
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
                  <div className="flex items-center border border-gray-300 rounded-md  ">
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

                <p className="text-[17px] mt-16 text-shadow-outline px-4 py-3 bg-black bg-opacity-50 rounded">
                  <a className="text-[#EAD298]"  a href="/">Sign up</a> or <a className="text-[#EAD298]" href="/registration"> Log in </a>to access all features and join our
                  community!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Books Section (always visible) */}
        <div className="mt-8">
          <h1 className="text-2xl text-white mb-4 text-center">
            Recommended Books
          </h1>

          {/* Show loading or books */}
          {loading ? (
            <p className="text-white text-center">Loading...</p>
          ) : books.length > 0 ? (
            <div className="px-4">
              <BookList books={books} />
            </div>
          ) : (
            <p className="text-white text-center">No books found.</p>
          )}

          {/* Pagination Buttons */}
          {totalItems > resultsPerPage && (
            <div className="flex justify-center mt-4 mb-4">
              <button
                onClick={handlePrevPage}
                disabled={startIndex === 0}
                className="px-4 py-2 bg-[#A83D3D] text-white rounded mr-2"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={startIndex + resultsPerPage >= totalItems}
                className="px-4 py-2 bg-[#A83D3D] text-white rounded"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
