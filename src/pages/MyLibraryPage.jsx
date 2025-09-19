import { useEffect, useState, useRef } from "react";
import {
  getLibrary,
  updateGoal,
  getGoal,
  addBookToPending,
  fetchPendingBooks,
  deletePendingBook,
  deleteMyLibraryBook,
  updateCurrentBookFromLibrary,
  addBookToCurrentFromLibrary,
  fetchCurrentBookFromLibrary,
  deleteCurrentBook,
  addBookToCompleted,
  fetchCompletedBooks,
  deleteCompletedBooks,
} from "../services/userLibrary.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faEdit,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

const MyLibrary = () => {
  const [books, setBooks] = useState([]);
  const [completedBooks, setCompletedBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [goal, setGoal] = useState(0);
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

        setBooks(library);
        setCompletedBooks(library.completedBooks || []);
        setPendingBooks(library.pendingBooks || []);
        setCurrentBook(library.currentBook || null);
        setSelectedBook(library.selectedBook || null);

        const current = await fetchCurrentBookFromLibrary();

        setCurrentBook(current);

        const completed = await fetchCompletedBooks();

        setCompletedBooks(completed);

        const pending = await fetchPendingBooks();

        setPendingBooks(pending);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadLibrary();
  }, []);

  useEffect(() => {
    if (isEditing && currentBook) {
      setBookDetails({
        bookId: currentBook._id || currentBook.bookId || "",
        coverImage: currentBook.coverImage || "",
        title: currentBook.title || "",
        author: currentBook.author || "",
        pages: currentBook.pages || "",
        progress: currentBook.progress ?? 0,
        startDate: currentBook.startDate
          ? new Date(currentBook.startDate).toISOString().split("T")[0]
          : "",
        endDate: currentBook.endDate
          ? new Date(currentBook.endDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      // Clear the form if not editing
      setBookDetails({
        bookId: "",
        coverImage: "",
        title: "",
        author: "",
        pages: "",
        progress: 0,
        startDate: "",
        endDate: "",
      });
    }
  }, [isEditing, currentBook]);

  const handleBookClick = (bookId) => {
    const book = books.find((b) => b._id === bookId);
    if (book) {
      setSelectedBook(book);
      setShowModal(true);
    } else {
    }
  };

  const handlePendingBookClick = (bookId) => {
    const book = pendingBooks.find((b) => b._id === bookId);
    if (book) {
      setSelectedBook(book);
      setShowPendingModal(true);
    } else {
    }
  };

  const handleAddToPending = async (bookId) => {
    try {
      const bookCover = selectedBook?.coverImage;
      const bookTitle = selectedBook?.title;
      const bookAuthor = selectedBook?.author;
      const result = await addBookToPending(
        bookId,
        bookCover,
        bookTitle,
        bookAuthor
      );

      setPendingBooks((prevPendingBooks) => [
        ...prevPendingBooks,
        result.pendingBook,
      ]);
    } catch (error) {}
  };

  const handleAddToCompleteMyLibrary = async (bookId) => {
    try {
      // Use selectedBook if set, otherwise fallback to currentBook
      const book = selectedBook || currentBook;

      if (!book || !book.bookId) {
        throw new Error("No valid book or missing book ID.");
      }

      const bookCover = book.coverImage;
      const bookTitle = book.title;
      const bookAuthor = book.author;

      if (!bookId || !bookCover || !bookTitle || !bookAuthor) {
        throw new Error(
          "Invalid Book ID, Missing Cover Image, Title or Author"
        );
      }

      const result = await addBookToCompleted(
        bookId,
        bookCover,
        bookTitle,
        bookAuthor
      );

      console.log("Book added to completed:", result);
    } catch (error) {
      console.error("Error adding book to completed:", error.message);
    }
  };

  const loadCompleteLibrary = async () => {
    try {
      setLoading(true);

      const completed = await fetchCompletedBooks();

      setCompletedBooks(completed || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCurrent = async (bookId) => {
    try {
      const bookCover = selectedBook?.coverImage;
      const bookTitle = selectedBook?.title;
      const bookAuthor = selectedBook?.author;

      const result = await addBookToCurrentFromLibrary(
        bookId,
        bookCover,
        bookTitle,
        bookAuthor
      );

      setCurrentBook(result);

      const current = await fetchCurrentBookFromLibrary();

      setCurrentBook(current);
    } catch (error) {}
  };

  const handleDeleteCurrentBook = async (bookId) => {
    try {
      const result = await deleteCurrentBook(bookId);

      if (result.success) {
        setCurrentBook(null);
        setIsEditing(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error deleting current book:", error);
    }
  };

  // --------------------------- current book from library--------------------//

  const handleDeletePendingBook = async (_id) => {
    try {
      const result = await deletePendingBook(_id);

      setPendingBooks((prevPendingBooks) =>
        prevPendingBooks.filter((book) => book._id !== _id)
      );
    } catch (error) {}
  };

  const handleDeleteCompletedBook = async (_id) => {
    try {
      const result = await deleteCompletedBooks(_id);

      setCompletedBooks((prevCompletedBooks) =>
        prevCompletedBooks.filter((book) => book._id !== _id)
      );
    } catch (error) {}
  };

  const saveGoal = async () => {
    try {
      await updateGoal(goal);
      alert("Goal saved!");
    } catch (error) {
      alert("Failed to save goal: " + error.message);
    }
  };

  const handleDeleteMyLibraryBook = async (_id) => {
    try {
      const result = await deleteMyLibraryBook(_id);

      setBooks((prevLibraryBooks) =>
        prevLibraryBooks.filter((book) => book._id !== _id)
      );
    } catch (error) {}
  };

  const [bookDetails, setBookDetails] = useState({
    title: "",
    author: "",
    pages: "",
    progress: 0,
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookDetails({
      ...bookDetails,
      [name]: name === "progress" || name === "pages" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await updateCurrentBookFromLibrary(
        bookDetails.bookId || currentBook?._id || currentBook?.bookId,
        bookDetails.coverImage || currentBook?.coverImage,
        bookDetails.title,
        bookDetails.author,
        bookDetails.pages,
        bookDetails.progress,
        bookDetails.startDate,
        bookDetails.endDate
      );
      const updatedBook = result.currentBook || result;
      if (updatedBook && (updatedBook._id || updatedBook.bookId)) {
        setCurrentBook(updatedBook);
      } else {
        setCurrentBook(currentBook);
      }
      setIsEditing(false);
    } catch (error) {
      setError("Failed to save current book");
      console.error(error);
    }
  };
  useEffect(() => {
    const loadCompletedBooks = async () => {
      const completed = await fetchCompletedBooks();
      console.log("Fetched Completed Books:", completed);
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

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const savedGoal = await getGoal(); // no userId passed
        setGoal(savedGoal);
      } catch (err) {
        console.error("Failed to fetch goal:", err.message);
      }
    };

    fetchGoal();
  }, []);

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
              <div className="relative group flex flex-col items-center">
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

                {/* Book Title and Author */}
                <div className="mt-2 text-center">
                  <p className="text-lg font-semibold text-gray-800">
                    {currentBook.title}
                  </p>
                  <p className="text-sm text-gray-600">{currentBook.author}</p>
                </div>
              </div>
            ) : (
              <div className="w-32 h-48 bg-gray-200 flex items-center justify-center text-gray-500 font-semibold rounded-lg border border-gray-300 shadow-md px-1">
                No Current Book
              </div>
            )}
          </div>
          {/* Buttons to add or edit book details */}

          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#a83d3d] text-[#EAD298] px-4 py-2 rounded-lg"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              onClick={() => {
                setSelectedBook(currentBook); // set selectedBook to currentBook
                handleAddToCompleteMyLibrary(currentBook.bookId);
              }}
              className="bg-[#a83d3d] text-[#EAD298] px-4 py-2 rounded-lg"
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
          </div>
        </div>

        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-2xl font-semibold text-center text-[#9B2D2D]">
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
                    value={bookDetails.progress || ""}
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
                    className=" text-white px-6 py-2 bg-[#a83d3d] rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className=" bg-gray-200 text-[#A83D3D] px-6 py-2 rounded-lg hover:bg-gray-300 "
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
          <div className="relative flex justify-center items-center mb-7">
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
                stroke="#a83d3d"
                strokeWidth="15"
                fill="none"
                strokeDasharray={`${
                  completedBooks.length > 0
                    ? (completedBooks.length / goal) * 565
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
                className="font-semibold text-2xl"
              >
                {completedBooks.length > 0
                  ? `${completedBooks.length}/${goal}`
                  : `0/${goal}`}
              </text>
            </svg>
          </div>

          <div className="text-center mb-4">
            <label className="text-gray-700 font-medium mr-2">
              Set Reading Goal:
            </label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              className="border p-1 rounded w-20 text-center"
              min="0"
            />

            <button
              onClick={saveGoal}
              className="ml-2 px-3 py-1 bg-[#a83d3d] text-[#EAD298] rounded hover:bg-[#7f2323] "
            >
              Save
            </button>
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
                          {/* <p className="font-medium text-gray-900">
                            Book ID: {book.bookId}
                          </p> */}
                          {/* Title and Author under image */}
                          <p className="text-sm font-semibold text-gray-800">
                            {book.title}
                          </p>
                          <p className="text-xs text-gray-500">{book.author}</p>
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
                  className="mt-4 bg-gray-200 text-[#A83D3D] text-1xl md:text-base py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-[#9B2D2D]">
          Pending Reads
        </h2>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-9 bg-white pointer-events-none z-40"></div>

          <div className="absolute right-0 top-0 bottom-0 w-9 bg-white pointer-events-none z-40"></div>

          <button
            onClick={() =>
              sliderRef.current.scrollBy({ left: -200, behavior: "smooth" })
            }
            className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-[#9B2D2D] text-white bg-[#EAD298] p-3 px-3 rounded-md shadow-lg hover:shadow-2xl transition-shadow duration-300 z-40"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="text-lg  text-[#9B2D2D]"
            />
          </button>

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
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                        <button
                          onClick={() => handlePendingBookClick(book._id)}
                          className="bg-black bg-opacity-85 text-white  w-12 h-12 rounded-full hover:bg-opacity-90 transition-opacity mx-2"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => handleDeletePendingBook(book._id)}
                          className="bg-red-600 text-white  w-12 h-12 rounded-full hover:bg-red-700 transition-opacity mx-2"
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
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-[#9B2D2D] bg-[#EAD298] p-3 px-3 rounded-md shadow-lg hover:shadow-2xl transition-shadow duration-300 z-40"
          >
            <FontAwesomeIcon
              icon={faArrowRight}
              className="text-lg text-[#9B2D2D]"
            />
          </button>
        </div>

        {showPendingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 mx-5">
              <h2 className="text-2xl mb-4 text-[#9B2D2D]">Add book to list</h2>
              <p>Would you like to add this book to your list?</p>
              <div className="mt-4">
                <button
                  onClick={() => handleAddToCurrent(selectedBook._id)}
                  className="bg-[#A83D3D] text-[#EAD298] text-2xl  md:text-base  py-2 px-4 rounded-lg hover:bg-[#1e3f1e]"
                >
                  Current
                </button>
                <button
                  onClick={() => handleAddToCompleteMyLibrary(selectedBook._id)}
                  className="border border-[#A83D3D] text-[#A83D3D]  text-2xl  md:text-base   bg-white py-2 px-4 rounded-lg hover:bg-[#EAD298] ml-4"
                >
                  Complete
                </button>
              </div>
              <button
                onClick={() => setShowPendingModal(false)}
                className="mt-4 bg-gray-200 text-[#A83D3D] text-1xl md:text-base py-2 px-4 rounded-lg hover:bg-gray-300"
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
        <h1 className="text-3xl font-bold mb-5 flex justify-center items-center text-[#9B2D2D]">
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
              className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-[#9B2D2D] text-white bg-[#EAD298] p-3 px-3 rounded-md shadow-lg hover:shadow-2xl transition-shadow duration-300 z-40"
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
                            className="bg-black bg-opacity-85 text-white  w-12 h-12 rounded-full hover:bg-opacity-90 transition-opacity mx-2"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => handleDeleteMyLibraryBook(book._id)}
                            className="bg-red-600 text-white w-12 h-12  rounded-full hover:bg-red-700 transition-opacity mx-2"
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
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-[#9B2D2D] bg-[#EAD298] p-3 px-3 rounded-md shadow-lg hover:shadow-2xl transition-shadow duration-300 z-40"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg  shadow-lg w-96">
            <h2 className="text-2xl mb-4 text-[#9B2D2D] ">Add book to list</h2>
            <p>Would you like to add this book to your list?</p>
            <div className="mt-4">
              <button
                onClick={() => handleAddToCurrent(selectedBook._id)}
                className="bg-[#A83D3D] text-[#EAD298] text-2xl  md:text-base  py-2 px-4 rounded-lg hover:bg-[#1e3f1e]"
              >
                Current
              </button>
              <button
                onClick={() => handleAddToPending(selectedBook._id)} // Pass book.id for the book to be added
                className="border border-[#A83D3D] text-[#A83D3D]  text-2xl  md:text-base   bg-white py-2 px-4 rounded-lg hover:bg-[#EAD298] ml-4"
              >
                Pending
              </button>

              <button
                onClick={() => handleAddToCompleteMyLibrary(selectedBook._id)}
                className="bg-[#EAD298] text-[#A83D3D] mt-4 py-2  text-2xl md:text-base px-4 rounded-lg hover:bg-yellow-600 ml-4"
              >
                Completed
              </button>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-gray-200 text-[#A83D3D] text-1xl md:text-base py-2 px-4 rounded-lg hover:bg-gray-300"
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
