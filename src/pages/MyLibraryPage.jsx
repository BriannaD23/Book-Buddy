import { useEffect, useState, useRef } from "react";
import {
  getLibrary,
  addBookToPending,
  fetchPendingBooks,
  deletePendingBook,
  deleteMyLibraryBook,
  updateCurrentBookFromLibrary,
  fetchCurrentBookFromLibrary,
  deleteCurrentBook,
  addBookToCompleted,
  fetchCompletedBooks,
  deleteCompletedBooks,
} from "../services/userLibrary.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const MyLibrary = () => {
  const [books, setBooks] = useState([]);
  const [completedBooks, setCompletedBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [pendingBooks, setPendingBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const sliderRef = useRef(null);
  const pendingSliderRef = useRef(null);

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

        const current = await fetchCurrentBookFromLibrary();
        console.log("Fetched Current Book:", current);
        setCurrentBook(current);

        const completed = await fetchCompletedBooks();
        console.log("Fetched Completed Book:", completed);
        setCompletedBooks(completed);

        const pending = await fetchPendingBooks();
        console.log("Fetched Pending Books:", pending);
        setPendingBooks(pending);
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
    const book = books.find((b) => b._id === bookId);
    if (book) {
      console.log("Found Book:", book);
      setSelectedBook(book);
      setShowModal(true);
    } else {
      console.log("Book not found with ID:", bookId);
    }
  };

  const handlePendingBookClick = (bookId) => {
    const book = pendingBooks.find((b) => b._id === bookId);
    if (book) {
      console.log("Found Pending Book:", book);
      setSelectedBook(book);
      setShowPendingModal(true);
    } else {
      console.log("Pending book not found with ID:", bookId);
    }
  };

  const handleAddToPending = async (bookId) => {
    try {
      const bookCover = selectedBook?.coverImage;
      const result = await addBookToPending(bookId, bookCover);
      console.log("Book added to pending list:", result);

      setPendingBooks((prevPendingBooks) => [
        ...prevPendingBooks,
        result.pendingBook,
      ]);
    } catch (error) {
      console.error("Failed to add book to pending:", error);
    }
  };

  const handleAddToCompleteMyLibrary = async (bookId) => {
    try {
      if (!selectedBook || !selectedBook._id) {
        throw new Error("No valid selected book or missing book ID.");
      }

      const bookCover = selectedBook.coverImage;
      if (!bookId || typeof bookId !== "string" || !bookCover) {
        throw new Error("Invalid Book ID or Missing Cover Image");
      }

      console.log("Attempting to add book to completed:", {
        bookId,
        bookCover,
      });

      const result = await addBookToCompleted(bookId, bookCover);

      if (!result || !result.success) {
        throw new Error(result.message || "Failed to add book to completed.");
      }

      console.log("Book added to completed list successfully:", result);
    } catch (error) {
      console.error("Error adding book to completed:", error.message);
    }
  };

  const loadCompleteLibrary = async () => {
    try {
      setLoading(true);

      const completed = await fetchCompletedBooks();
      console.log("Fetched Completed Books:", completed); // Ensure this logs the correct data
      setCompletedBooks(completed || []);
    } catch (err) {
      console.error("Error loading completed books:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCurrent = async (bookId) => {
    try {
      const bookCover = selectedBook?.coverImage;

      const result = await updateCurrentBookFromLibrary(bookId, bookCover);
      console.log("Book added to current:", result);

      setCurrentBook(result);

      const current = await fetchCurrentBookFromLibrary();
      console.log("Fetched Current Book:", current);

      setCurrentBook(current);
    } catch (error) {
      console.error("Failed to add book to current:", error);
    }
  };

  const handleDeleteCurrentBook = async (bookId) => {
    try {
      const result = await deleteCurrentBook(bookId);

      if (result.success) {
        console.log("Deleted current book:", result.currentBook);
        setCurrentBook(result.currentBook);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Failed to delete current book:", error);
    }
  };

  // --------------------------- current book from library--------------------//

  const handleDeletePendingBook = async (_id) => {
    console.log("handleDeletePendingBook triggered with _id:", _id); // Debug

    try {
      const result = await deletePendingBook(_id);
      console.log("Deleted pending book:", result);

      setPendingBooks((prevPendingBooks) =>
        prevPendingBooks.filter((book) => book._id !== _id)
      );
    } catch (error) {
      console.error("Failed to delete pending book:", error);
    }
  };

  const handleDeleteCompletedBook = async (_id) => {
    console.log("Deleted Completed book with _id:", _id); // Debug

    try {
      const result = await deleteCompletedBooks(_id);
      console.log("Deleted completed book:", result);

      setCompletedBooks((prevCompletedBooks) =>
        prevCompletedBooks.filter((book) => book._id !== _id)
      );
    } catch (error) {
      console.error("Failed to delete completed book:", error);
    }
  };

  const handleDeleteMyLibraryBook = async (_id) => {
    console.log(`Deleting book with ID: ${_id}`);

    try {
      const result = await deleteMyLibraryBook(_id);
      console.log("Deleted library book:", result);

      setBooks((prevLibraryBooks) =>
        prevLibraryBooks.filter((book) => book._id !== _id)
      );
    } catch (error) {
      console.error("Failed to delete library book:", error);
    }
  };

  const [bookDetails, setBookDetails] = useState({
    title: "Book Title",
    author: "Author Name",
    pages: "Total Pages",
    progress: "Progress",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    setBookDetails({
      ...bookDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Book details submitted:", bookDetails);
    setIsEditing(false);
  };

  useEffect(() => {
    const loadCompletedBooks = async () => {
      const completed = await fetchCompletedBooks();
      console.log("Fetched Completed Books:", completed); // Log to check
      setCompletedBooks(completed);
    };
    loadCompletedBooks();
  }, []);

  const toggleModal = () => {
    setShowCompletedModal(!showCompletedModal);
    if (!showCompletedModal) {
      loadCompleteLibrary();
    }
  };

  const totalBooks = completedBooks.length + pendingBooks.length;

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
            {currentBook?.coverImage ? (
              <div className="relative group">
                <img
                  src={currentBook.coverImage}
                  alt="Book Cover"
                  className="w-32 h-48 object-cover rounded-lg"
                />
                {/* Delete button */}
                <button
                  onClick={() => handleDeleteCurrentBook(currentBook.bookId)}
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                >
                  Delete Book
                </button>
              </div>
            ) : (
              <div className="w-32 h-48 bg-gray-200 flex items-center justify-center text-gray-500 font-semibold rounded-lg border border-gray-300 shadow-md px-1">
                No Current Book
              </div>
            )}
          </div>
          {/* Buttons to add or edit book details */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Edit
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Add
            </button>
          </div>
        </div>

        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-2xl font-semibold text-center text-gray-800">
                  {bookDetails.title ? "Edit Book" : "Add Book"}
                </h2>

                <div className="flex items-center space-x-4">
                  <label htmlFor="title" className="w-32 text-gray-700">
                    Title:
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={bookDetails.title}
                    onChange={handleChange}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label htmlFor="author" className="w-32 text-gray-700">
                    Author:
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={bookDetails.author}
                    onChange={handleChange}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label htmlFor="pages" className="w-32 text-gray-700">
                    Pages:
                  </label>
                  <input
                    type="number"
                    name="pages"
                    value={bookDetails.pages}
                    onChange={handleChange}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label htmlFor="progress" className="w-32 text-gray-700">
                    Progress:
                  </label>
                  <input
                    type="number"
                    name="progress"
                    value={bookDetails.progress}
                    onChange={handleChange}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label htmlFor="startDate" className="w-32 text-gray-700">
                    Start Date:
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={bookDetails.startDate}
                    onChange={handleChange}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label htmlFor="endDate" className="w-32 text-gray-700">
                    End Date:
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={bookDetails.endDate}
                    onChange={handleChange}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}



        {/* -----------------------------Completed Books Section ------------------------------------*/}
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
                  completedBooks.length > 0
                    ? (completedBooks.length / totalBooks) * 565 // Circumference of the circle
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
                {completedBooks.length > 0
                  ? `${completedBooks.length}/${totalBooks}`
                  : "No Books"}
              </text>
            </svg>
          </div>
          {/* "View Completed Books" Link */}
          <div className="text-center mt-4">
            <button
              onClick={toggleModal}
              className="text-[#9B2D2D] font-medium underline hover:text-[#3e8e41]"
            >
              View Completed Books
            </button>
          </div>

          {showCompletedModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div
                className="bg-white p-6 rounded-lg w-3/4 md:w-1/2 shadow-xl"
                onClick={(e) => e.stopPropagation()} // Prevent closing modal on click inside
              >
                <h3 className="text-xl font-semibold mb-4 text-[#9B2D2D]">
                  Completed Books
                </h3>
                {completedBooks && completedBooks.length > 0 ? (
                  <ul className="space-y-4">
                    {completedBooks.map((book) => (
                      <li
                        key={book._id}
                        className="flex items-center space-x-4 p-2 border-b border-gray-300 last:border-none"
                      >
                        {book.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={`Book Cover`}
                            className="w-16 h-24 object-cover rounded shadow"
                          />
                        ) : (
                          <div className="w-16 h-24 bg-gray-200 text-gray-600 flex items-center justify-center rounded shadow">
                            No Image
                          </div>
                        )}

                        {/* Render book ID */}
                        <div className="text-left">
                          <p className="font-medium text-gray-900">
                            Book ID: {book.bookId}
                          </p>
                          <p className="text-sm text-gray-500">
                            Database ID: {book._id}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDeleteCompletedBook(book._id)}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          🗑️
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-500">
                    No completed books yet.
                  </p>
                )}
                <button
                  onClick={toggleModal}
                  className="mt-4 text-[#9B2D2D] font-medium underline hover:text-[#3e8e41]"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pending Books Section with Placeholder */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold mb-4">Pending Reads</h2>
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
            className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-[#9B2D2D] text-white bg-[#EAD298] p-3 px-3 rounded-md shadow-lg hover:shadow-2xl transition-shadow duration-300 z-50"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="text-lg  text-[#9B2D2D]"
            />
          </button>

          {/* Pending Books Slider */}
          <div
            ref={pendingSliderRef}
            className="book-slider flex overflow-x-scroll hide-scrollbar py-1 snap-x snap-mandatory scroll-smooth"
            style={{ paddingLeft: "40px", paddingRight: "10px" }}
          >
            {pendingBooks.length > 0 ? (
              pendingBooks.map((book, index) => (
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
                          onClick={() => handlePendingBookClick(book._id)}
                          className="bg-black bg-opacity-85 text-white p-3 rounded-full hover:bg-opacity-90 transition-opacity mx-2"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => handleDeletePendingBook(book._id)}
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
              <div className="flex justify-center items-center w-full h-full pl-3 pr-9">
                <div className="w-32 h-48 bg-gray-200 flex items-center justify-center text-gray-500 font-semibold rounded-lg border border-gray-300 shadow-md ">
                  No Pending <br />
                  Books
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() =>
              pendingSliderRef.current.scrollBy({
                left: 200,
                behavior: "smooth",
              })
            }
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-[#9B2D2D] bg-[#EAD298] p-3 px-3 rounded-md shadow-lg hover:shadow-2xl transition-shadow duration-300 z-50"
          >
            <FontAwesomeIcon
              icon={faArrowRight}
              className="text-lg text-[#9B2D2D]"
            />
          </button>
        </div>
        {showPendingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-2xl mb-4 text-[#9B2D2D]">Add book to list</h2>
              <p>Would you like to add this book to your list?</p>
              <div className="mt-4">
                <button
                  onClick={() => handleAddToCurrent(selectedBook._id)}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                >
                  Add to Current
                </button>
                <button
                  onClick={() =>
                    handleAddToCurrentFromPending(selectedBook._id)
                  }
                  className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 ml-4"
                >
                  Add to Complete
                </button>
              </div>
              <button
                onClick={() => setShowPendingModal(false)}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Right Arrow */}
      </div>

      {/* My Books Section-------------------------------- */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-5 flex justify-center items-center">
          My Books
        </h1>
        {loading ? (
          <p>Loading books...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-9 bg-white pointer-events-none z-40"></div>

            <div className="absolute right-0 top-0 bottom-0 w-9 bg-white pointer-events-none z-40"></div>

            <button
              onClick={() =>
                sliderRef.current.scrollBy({ left: -200, behavior: "smooth" })
              }
              className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-[#9B2D2D] text-white bg-[#EAD298] p-3 px-3 rounded-md shadow-lg hover:shadow-2xl transition-shadow duration-300 z-50"
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="text-lg  text-[#9B2D2D]"
              />
            </button>

            {/* Books Slider */}
            <div
              ref={sliderRef}
              className="book-slider flex  overflow-x-scroll hide-scrollbar py-1 snap-x snap-mandatory scroll-smooth"
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
                            onClick={() => handleDeleteMyLibraryBook(book._id)}
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
                <div className="flex justify-center items-center w-full h-full pl-3 pr-9">
                  <div className="w-32 h-48 bg-gray-200 flex items-center justify-center text-gray-500 font-semibold rounded-lg border border-gray-300 shadow-md ">
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
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-[#9B2D2D] bg-[#EAD298] p-3 px-3 rounded-md shadow-lg hover:shadow-2xl transition-shadow duration-300 z-50"
            >
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-lg text-[#9B2D2D]"
              />
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
                onClick={() => handleAddToCurrent(selectedBook._id)} // Placeholder action
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

              <button
                onClick={() => handleAddToCompleteMyLibrary(selectedBook._id)}
                className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 ml-4"
              >
                Add to Completed
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
