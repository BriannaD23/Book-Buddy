import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

<FontAwesomeIcon icon="fa-solid fa-arrow-right" />;

const DiscoverPage = () => {
  const [booksByGenre, setBooksByGenre] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingGenre, setLoadingGenre] = useState("");
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const scrollRef = useRef({});

  const GENRES = ["manga", "self-help", "fantasy", "drama", "nonfiction"];
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchBooksByGenre = async (genre, maxResults = 10) => {
    try {
      const DISCOVER_KEY = import.meta.env.VITE_API_KEY;
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&maxResults=${maxResults}&key=${DISCOVER_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch books for genre: ${genre}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    const loadBooksByGenre = async () => {
      if (isFetching) return;
      setIsFetching(true);
      setLoading(true);
      for (const genre of GENRES) {
        try {
          setLoadingGenre(genre);

          const books = await fetchBooksByGenre(genre, 10);
          setBooksByGenre((prev) => ({ ...prev, [genre]: books }));
          await delay(300);
        } catch (err) {
          console.error(`Error loading books for genre: ${genre}`);
        } finally {
          setLoadingGenre("");
        }
      }

      setLoading(false);
      setIsFetching(false);
    };

    loadBooksByGenre();
  }, []);

  const handleLoadMore = async (genre) => {
    try {
      setLoading(true);
      setLoadingGenre(genre);

      const newBooks = await fetchBooksByGenre(genre, 20);
      setBooksByGenre((prev) => ({
        ...prev,
        [genre]: [...prev[genre], ...newBooks],
      }));
    } catch (err) {
      setError("Failed to load more books.");
    } finally {
      setLoading(false);
      setLoadingGenre("");
    }
  };

  const handleScroll = (genre, direction) => {
    const container = scrollRef.current[genre];
    if (container) {
      const scrollAmount = direction === "left" ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-4xl mt-9 mb-10 text-center text-[#9B2D2D]">
        Discover Books 📚
      </h1>
      {error && <p className="text-red-500">{error}</p>}
      {Object.entries(booksByGenre).length === 0 && loading ? (
        <p>Loading books...</p>
      ) : (
        GENRES.map((genre) => (
          <div key={genre} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 capitalize">{genre}</h2>
            {loadingGenre === genre ? (
              <p>Loading {genre} books...</p>
            ) : booksByGenre[genre]?.length > 0 ? (
              <div className="relative">
                {/* Left Solid Background */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-white pointer-events-none z-40"></div>

                {/* Right Solid Background */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-white pointer-events-none z-40"></div>

                <div
                  ref={(el) => (scrollRef.current[genre] = el)}
                  className="book-slider flex overflow-x-scroll hide-scrollbar py-1 snap-x snap-mandatory scroll-smooth"
                  style={{ paddingLeft: "40px", paddingRight: "10px" }}
                >
                  {booksByGenre[genre].map((book) => (
                    <div className="w-36  md:w-48 flex-shrink-0 text-center">
                      <div className="w-32 h-48 snap-center  mx-1 mt-3 relative overflow-hidden rounded-lg shadow-lg border border-gray-200">
                        {book.volumeInfo.imageLinks?.thumbnail ? (
                          <img
                            src={book.volumeInfo.imageLinks.thumbnail}
                            alt={book.volumeInfo.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            No Image
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium mt-2 h-10 overflow-hidden text-ellipsis">
                        {book.volumeInfo.title}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Left Arrow */}

                <button
                  onClick={() => handleScroll(genre, "left")}
                  className="absolute top-1/2 left-1 transform -translate-y-1/2 bg-[#EAD298] p-3 px-3 rounded-md shadow-lg hover:shadow-2xl transition-shadow duration-300 z-50"
                  disabled={loadingGenre === genre}
                >
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="text-lg  text-[#9B2D2D]"
                  />
                </button>

                {/* Right Arrow */}
                <button
                  onClick={() => handleScroll(genre, "right")}
                  className="absolute top-1/2 right-1 transform -translate-y-1/2 text-white bg-[#EAD298] p-3 px-3 rounded-md shadow-lg hover:shadow-2xl transition-shadow duration-300 z-50"
                  disabled={loadingGenre === genre}
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-lg text-[#9B2D2D]"
                  />
                </button>
              </div>
            ) : (
              <p>No books available for this genre.</p>
            )}
            <button
              onClick={() => handleLoadMore(genre)}
              className="mt-4 text-[#9B2D2D] "
              disabled={loadingGenre === genre}
            >
              {loadingGenre === genre ? "Loading..." : "Load More"}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default DiscoverPage;
