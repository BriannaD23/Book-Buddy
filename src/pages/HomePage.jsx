import React, { useEffect, useState } from "react";
import BookList from "../components/Booklist.jsx";
import HomeLayout from "../components/HomeLayout.jsx";

const Home = () => {
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

  useEffect(() => {
    setBooks([]);
    fetchBooks();
  }, [searchQuery, startIndex]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setStartIndex(0);
  };

  const handleNextPage = () => {
    setStartIndex(startIndex + resultsPerPage);
  };

  const handlePrevPage = () => {
    setStartIndex(Math.max(startIndex - resultsPerPage, 0));
  };

  return (
    <HomeLayout searchQuery={searchQuery} handleSearchChange={handleSearchChange}>
      <div className="mt-8">
        <h1 className="text-2xl text-[#A83D3D] mb-4 text-center">
          Recommended Books
        </h1>

        {loading ? (
          <p className="text-[#A83D3D] text-center">Loading...</p>
        ) : books.length > 0 ? (
          <div className="px-4">
            <BookList books={books} />
          </div>
        ) : (
          <p className="text-[#A83D3D] text-center">No books found.</p>
        )}

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
     
    </HomeLayout>
  );
};

export default Home;



