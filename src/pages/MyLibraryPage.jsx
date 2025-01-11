import { useEffect, useState, useRef } from "react";
import { getLibrary, addBookToPending } from "../services/userLibrary.js";

const MyLibrary = () => {
  const [books, setBooks] = useState([]);
  const [completedBooks, setCompletedBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingBooks, setPendingBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const sliderRef = useRef(null);

  useEffect(() => {
    const loadLibrary = async () => {
      try {
        setLoading(true);
        const library = await getLibrary();
        console.log("Loaded Library:", library);
        setBooks(library);
        setCompletedBooks(library.completedBooks || []);
        setPendingBooks(library.pendingBooks || []);
        setCurrentBook(library.currentBook || null);
        setSelectedBook(library.selectedBook || null);
      } catch (err) {
        console.error("Error loading library:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadLibrary();
  }, []);

  const handleBookClick = (bookId) => {
    const book = books.find((b) => b._id === bookId);  // Use _id here
    if (book) {
      console.log("Found Book:", book);
      setSelectedBook(book);
      setShowModal(true);
    } else {
      console.log("Book not found with ID:", bookId);
    }
  };
  
  const handleAddToPending = (bookId) => {
    if (!bookId) {
      console.error("Error: No bookId provided to handleAddToPending"); // Log issue
      return;
    }
  
    const payload = {
      bookId,
      bookCover: selectedBook?.coverImage, // Use safe navigation
    };
  
    console.log("Adding to Pending:", payload); // Log the payload
  };

  const handleDeleteBook = (bookId) => {
    // Your delete logic here
    console.log(`Deleting book ${bookId}`);
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl mt-9 mb-10 text-center text-[#9B2D2D]">
        Your Library 📚
      </h1>
      <div className="flex flex-wrap md:flex-nowrap gap-5 px-7 mb-11">
        {/* Currently Reading Section */}
        <div className="w-full md:w-1/2 p-5 border-2 border-gray-300 shadow-lg rounded-lg bg-white">
          <h2 className="text-2xl font-semibold mb-4 text-[#9B2D2D] text-center">
            Currently Reading
          </h2>
          <div className="relative flex justify-center items-center">
            {!currentBook && (
              <div className="w-32 h-48 bg-gray-200 flex items-center justify-center text-gray-500 font-semibold rounded-lg border border-gray-300 shadow-md px-1">
                No Current Book
              </div>
            )}
          </div>
        </div>

        {/* Completed Books Section */}
        <div className="w-full md:w-1/2 p-5 border-2 border-gray-300 shadow-lg rounded-lg bg-white">
          <h2 className="text-2xl font-semibold mb-4 text-[#9B2D2D] text-center">
            Completed Books
          </h2>
          <div className="relative flex justify-center items-center">
            {/* Circular Progress Ring */}
            <svg
              width="160"
              height="160"
              viewBox="0 0 200 200"
              className="mx-auto"
            >
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="#e6e6e6"
                strokeWidth="15"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="#4caf50"
                strokeWidth="15"
                fill="none"
                strokeDasharray={`${
                  books.length > 0
                    ? (completedBooks.length / books.length) * 565 // Circumference of the circle
                    : 0
                } 565`}
                strokeDashoffset="25"
                transform="rotate(-90 100 100)"
              />
              {/* Center text */}
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                fill="#9B2D2D"
                dy=".3em"
                className="font-semibold text-lg"
              >
                {books.length > 0
                  ? `${completedBooks.length}/${books.length}`
                  : "No Books"}
              </text>
            </svg>
          </div>
          {/* "View Completed Books" Link */}
          <div className="text-center mt-4">
            <a
              href="#completed-books"
              className="text-[#9B2D2D] font-medium underline hover:text-[#3e8e41]"
            >
              View Completed Books
            </a>
          </div>
        </div>
      </div>

      {/* Pending Books Section with Placeholder */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold mb-4">Pending Reads</h2>
        <div className="flex gap-4 overflow-x-auto">
          {pendingBooks.length > 0 ? (
            pendingBooks.map((book, index) => (
              <div
                key={book._id || index}
                className="book-item flex-shrink-0 w-48 snap-center transition-transform transform duration-300 ease-in-out text-center relative hover:z-20 hover:scale-110"
                style={{
                  marginLeft: "-40px",
                  marginRight: "-40px",
                  overflow: "visible",
                }}
              >
                {book.coverImage ? (
                  <div className="relative">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-40 h-80 object-cover mt-3 mx-auto transition-all duration-300 ease-in-out rounded-lg shadow-lg border border-gray-200"
                    />
                  </div>
                ) : (
                  <p>No cover image available</p>
                )}
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center w-full h-full">
              <div className="w-32 h-48 bg-gray-200 flex items-center justify-center text-gray-500 font-semibold rounded-lg border border-gray-300 shadow-md">
                No Pending Reads
              </div>
            </div>
          )}
        </div>
      </div>
      {/* My Books Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-5">My Books</h1>
        {loading ? (
          <p>Loading books...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="relative">
            {/* Left Solid Background */}
            <div className="absolute left-0 top-0 bottom-0 w-9 bg-white pointer-events-none z-40"></div>

            {/* Right Solid Background */}
            <div className="absolute right-0 top-0 bottom-0 w-9 bg-white pointer-events-none z-40"></div>

            {/* Left Arrow */}
            <button
              onClick={() =>
                sliderRef.current.scrollBy({ left: -200, behavior: "smooth" })
              }
              className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-[#9B2D2D] text-white p-2 rounded-full z-50 shadow-lg"
            >
              ←
            </button>

            {/* Books Slider */}
            <div
              ref={sliderRef}
              className="book-slider flex overflow-x-scroll hide-scrollbar py-1 snap-x snap-mandatory scroll-smooth"
              style={{ paddingLeft: "40px", paddingRight: "10px" }}
            >
              {books.length > 0 ? (
                books.map((book, index) => (
                  <div
                    key={book._id || index}
                    className="inline-block w-36 md:w-48 snap-center transition-transform transform duration-300 ease-in-out text-center relative hover:z-20 hover:scale-110 mx-1 group"
                  >
                    {book.coverImage ? (
                      <div className="relative">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="min-w-32 max-h-48 object-cover mt-3 mx-auto transition-all duration-300 ease-in-out rounded-lg shadow-lg border border-gray-200"
                        />
                        {/* Hover buttons */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                          <button
                            onClick={() => handleBookClick(book._id)}
                            className="bg-black bg-opacity-85 text-white p-3 rounded-full hover:bg-opacity-90 transition-opacity mx-2"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book.id)}
                            className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-opacity mx-2"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p>No cover image available</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center w-full h-full">
                  <div className="w-32 h-48 bg-gray-200 flex items-center justify-center text-gray-500 font-semibold rounded-lg border border-gray-300 shadow-md">
                    No Books
                  </div>
                </div>
              )}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() =>
                sliderRef.current.scrollBy({ left: 200, behavior: "smooth" })
              }
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-[#9B2D2D] text-white p-2 rounded-full z-50 shadow-lg"
            >
              →
            </button>
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl mb-4 text-[#9B2D2D]">Add book to list</h2>
            <p>Would you like to add this book to your list?</p>
            <div className="mt-4">
              <button
                onClick={() => console.log("Add to Current clicked")} // Placeholder action
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              >
                Add to Current
              </button>
              <button
                onClick={() => handleAddToPending(selectedBook._id)} // Pass book.id for the book to be added
                className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 ml-4"
              >
                Add to Pending
              </button>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLibrary;
