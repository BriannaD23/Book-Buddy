import { useEffect, useState, useRef } from "react";
import { getLibrary } from "../services/userLibrary.js";
import gsap from "gsap"; // Import GSAP

const MyLibrary = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const sliderRef = useRef(null); // Create a ref for the slider container

  useEffect(() => {
    const loadLibrary = async () => {
      try {
        setLoading(true);
        const library = await getLibrary();
        console.log("Loaded Library:", library);
        setBooks(library);
      } catch (err) {
        console.error("Error loading library:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadLibrary();
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-5">My Books</h1>
      {loading ? (
        <p>Loading books...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() =>
              sliderRef.current.scrollBy({ left: -200, behavior: "smooth" })
            }
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
          >
            ←
          </button>

          <div
            ref={sliderRef} // Attach ref here
            className="book-slider flex overflow-x-hidden py-5 snap-x snap-mandatory"
            style={{ paddingLeft: "50px", paddingRight: "50px" }} // Add extra padding for overlap
          >
            {books.length > 0 ? (
              books.map((book, index) => (
                <div
                  key={book._id || index}
                  className="book-item flex-shrink-0 w-48 snap-center transition-transform transform duration-300 ease-in-out text-center relative hover:z-20 hover:scale-110"
                  style={{
                    marginLeft: "-40px",
                    marginRight: "-40px",
                    overflow: "visible", // Ensure the book can grow out of the container
                  }}
                >
                  {book.coverImage ? (
                    <div className="relative">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-40 h-64 object-cover mt-3 mx-auto transition-all duration-300 ease-in-out rounded-lg shadow-lg border border-gray-200"
                        style={{
                          transition: "transform 0.3s ease, z-index 0s", // Ensure transition timing
                        }}
                      />
                    </div>
                  ) : (
                    <p>No cover image available</p>
                  )}
                </div>
              ))
            ) : (
              <p>No books found</p>
            )}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() =>
              sliderRef.current.scrollBy({ left: 200, behavior: "smooth" })
            }
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default MyLibrary;
