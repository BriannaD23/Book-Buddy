import React, { useState } from 'react';
import { addBookToLibrary } from '../services/userLibrary.js';
import { decodeTokenPayload } from "../utils/cookieUtils.js"; 


const BookListWithAddButton = ({ books, fetchBooks }) => {
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [error, setError] = useState(null);

  const handleBookClick = (id) => {
    if (selectedBookId === id) {
      setSelectedBookId(null);
    } else {
      setSelectedBookId(id);
    }
  };

  const handleAddBook = async (book) => {
    try {
      // Use the decodeTokenPayload utility to get the token
      const { token, payload } = decodeTokenPayload();
      if (!token) {
        setError('No token found. Please log in again.');
        return;
      }

      // Add the book to the library using the token
      await addBookToLibrary(book.id, token);
      alert('Book added to library!');

    } catch (error) {
      setError('Failed to add the book. Please try again.');
      console.error(error.message);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 p-6">
      {books.map((book) => (
        <div
          key={book.id}
          className={`rounded-lg flex flex-col items-center group relative ${selectedBookId ? 'pointer-events-none' : ''}`}
        >
          {/* Book container */}
          <div className="relative w-32 h-48 mb-4 cursor-pointer group">
            <div className="absolute inset-0 bg-gray-300 rounded-lg shadow-md transform -translate-x-2 translate-y-2 z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-gray-600 rounded-lg z-20"></div>
            <img
              src={book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150"}
              alt={book.volumeInfo.title}
              className="w-full h-full object-cover transition-transform duration-300 z-30 relative rounded-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-20 z-40"></div>
            <button
              onClick={() => handleBookClick(book.id)}
              className="absolute inset-0 flex items-center justify-center text-white font-bold bg-black bg-opacity-50 hover:bg-opacity-75 transition-opacity duration-300 z-50 opacity-0 group-hover:opacity-100"
            >
              More Info
            </button>
          </div>

          {/* Book Title and Author */}
          <div className="text-center mt-4">
            <h3 className="text-[16px] font-semibold mb-2">{book.volumeInfo.title}</h3>
            <p className="text-sm text-gray-600">{book.volumeInfo.authors?.join(", ") || "Unknown Author"}</p>
          </div>

          {/* Detailed Info Block */}
          {selectedBookId === book.id && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 pointer-events-auto">
              <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center relative max-w-3xl mx-auto">
                <img
                  src={book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150"}
                  alt={book.volumeInfo.title}
                  className="w-48 h-64 object-cover rounded-lg sm:w-64 sm:h-80"
                />
                <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left overflow-hidden">
                  <h3 className="text-lg font-semibold mb-2">{book.volumeInfo.title}</h3>
                  <p className="text-sm text-gray-600">{book.volumeInfo.authors?.join(", ") || "Unknown Author"}</p>
                  <div className="text-sm mt-2 max-h-48 overflow-y-auto">
                    {book.volumeInfo.description ? book.volumeInfo.description : "No description available"}
                  </div>

                  {/* Add to Library Button */}
                  <button
                    onClick={() => handleAddBook(book)}
                    className="mt-4 px-4 py-2 bg-[#9B2D2D] text-white rounded-lg hover:bg-[#7A1F1F]"
                  >
                    Add to Library
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedBookId(null)}
                    className="absolute top-2 right-2 text-sm text-[#9B2D2D] underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Error message */}
      {error && (
        <div className="mt-4 text-red-500 text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default BookListWithAddButton;
