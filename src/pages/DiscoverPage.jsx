// import { useEffect, useState, useRef } from "react";

// const DiscoverPage = () => {
//   const [booksByGenre, setBooksByGenre] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loadingGenre, setLoadingGenre] = useState("");
//   const [error, setError] = useState(null);
//   const scrollRef = useRef({});

//   const GENRES = ["manga", "self-help", "fantasy", "drama", "nonfiction"];

//   const fetchBooksByGenre = async (genre, maxResults = 10) => {
//     try {
//       const DISCOVER_KEY = import.meta.env.VITE_API_KEY;
//       const response = await fetch(
//         `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&maxResults=${maxResults}&key=${DISCOVER_KEY}`
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to fetch books for genre: ${genre}`);
//       }

//       const data = await response.json();
//       return data.items || [];
//     } catch (err) {
//       console.error(err);
//       throw err;
//     }
//   };

//   useEffect(() => {
//     const loadBooksByGenre = async () => {
//       for (const genre of GENRES) {
//         try {
//           setLoading(true);
//           setLoadingGenre(genre);

//           const books = await fetchBooksByGenre(genre, 10);
//           setBooksByGenre((prev) => ({ ...prev, [genre]: books }));
//         } catch (err) {
//           console.error(`Error loading books for genre: ${genre}`);
//         } finally {
//           setLoadingGenre("");
//           setLoading(false);
//         }
//       }
//     };

//     loadBooksByGenre();
//   }, []);

//   const handleLoadMore = async (genre) => {
//     try {
//       setLoading(true);
//       setLoadingGenre(genre);

//       const newBooks = await fetchBooksByGenre(genre, 20);
//       setBooksByGenre((prev) => ({
//         ...prev,
//         [genre]: [...prev[genre], ...newBooks],
//       }));
//     } catch (err) {
//       setError("Failed to load more books.");
//     } finally {
//       setLoading(false);
//       setLoadingGenre("");
//     }
//   };

//   const handleScroll = (genre, direction) => {
//     const container = scrollRef.current[genre];
//     if (container) {
//       const scrollAmount = direction === "left" ? -200 : 200;
//       container.scrollBy({ left: scrollAmount, behavior: "smooth" });
//     }
//   };

//   return (
//     <div className="p-5">
//       <h1 className="text-4xl  mt-9 mb-10 text-center text-[#9B2D2D]">Discover Books 📚</h1>
//       {error && <p className="text-red-500">{error}</p>}
//       {Object.entries(booksByGenre).length === 0 && loading ? (
//         <p>Loading books...</p>
//       ) : (
//         GENRES.map((genre) => (
//           <div key={genre} className="mb-10">
//             <h2 className="text-2xl font-semibold mb-4 capitalize">{genre}</h2>
//             {loadingGenre === genre ? (
//               <p>Loading {genre} books...</p>
//             ) : booksByGenre[genre]?.length > 0 ? (
//               <div className="relative">
//                 <div
//                   ref={(el) => (scrollRef.current[genre] = el)}
//                   className="flex gap-4 hide-scrollbar"
//                   style={{ overflowX: "auto" }}
//                 >
//                   {booksByGenre[genre].map((book) => (
//                     <div
//                       key={book.id}
//                       className="w-40 flex-shrink-0 text-center"
//                     >
//                       {book.volumeInfo.imageLinks?.thumbnail ? (
//                         <img
//                           src={book.volumeInfo.imageLinks.thumbnail}
//                           alt={book.volumeInfo.title}
//                           // w-full h-60
//                           className="rounded-lg mb-2  w-32 h-48 object-cover"
//                         />
//                       ) : (
//                         <div className="w-32 h-48  bg-gray-200 rounded-lg flex items-center justify-center">
//                           No Image
//                         </div>
//                       )}
//                       <p className="text-sm  font-medium">
//                         {book.volumeInfo.title}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="absolute top-1/2 left-0 transform -translate-y-1/2">

//                   <button
//                     onClick={() => handleScroll(genre, "left")}
//                     className="text-3xl text-white  bg-[#9B2D2D] p-1 rounded-full shadow-lg hover:shadow-2xl transition-shadow duration-300"
//                     disabled={loadingGenre === genre}
//                   >
//                     &#8592;
//                   </button>
//                 </div>
//                 <div className="absolute top-1/2 right-[-30px] transform -translate-y-1/2 z-10">
//                   <button
//                     onClick={() => handleScroll(genre, "right")}
//                     className="text-3xl text-white  bg-[#9B2D2D] p-1 rounded-full shadow-lg hover:shadow-2xl transition-shadow duration-300"
//                     disabled={loadingGenre === genre}
//                   >
//                     &#8594;
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <p>No books available for this genre.</p>
//             )}
//             <button
//               onClick={() => handleLoadMore(genre)}
//               className="mt-4 text-blue-500"
//               disabled={loadingGenre === genre}
//             >
//               {loadingGenre === genre ? "Loading..." : "Load More"}
//             </button>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default DiscoverPage;

import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight , faArrowLeft  } from "@fortawesome/free-solid-svg-icons";

<FontAwesomeIcon icon="fa-solid fa-arrow-right" />;

const DiscoverPage = () => {
  const [booksByGenre, setBooksByGenre] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingGenre, setLoadingGenre] = useState("");
  const [error, setError] = useState(null);
  const scrollRef = useRef({});

  const GENRES = ["manga", "self-help", "fantasy", "drama", "nonfiction"];

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
      for (const genre of GENRES) {
        try {
          setLoading(true);
          setLoadingGenre(genre);

          const books = await fetchBooksByGenre(genre, 10);
          setBooksByGenre((prev) => ({ ...prev, [genre]: books }));
        } catch (err) {
          console.error(`Error loading books for genre: ${genre}`);
        } finally {
          setLoadingGenre("");
          setLoading(false);
        }
      }
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
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-white pointer-events-none z-40"></div>

                {/* Right Solid Background */}
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-white pointer-events-none z-40"></div>

                <div
                  ref={(el) => (scrollRef.current[genre] = el)}
                  className="flex gap-4 hide-scrollbar"
                  style={{ overflowX: "auto", paddingLeft: "20px" }}
                >
                  {booksByGenre[genre].map((book) => (
                    <div
                      key={book.id}
                      className="w-40 flex-shrink-0 text-center"
                    >
                      {book.volumeInfo.imageLinks?.thumbnail ? (
                        <img
                          src={book.volumeInfo.imageLinks.thumbnail}
                          alt={book.volumeInfo.title}
                          className="rounded-lg mb-2 w-32 h-48 object-cover"
                        />
                      ) : (
                        <div className="w-32 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                          No Image
                        </div>
                      )}
                      <p className="text-sm font-medium">
                        {book.volumeInfo.title}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Left Arrow */}
               
                <button
                  onClick={() => handleScroll(genre, "left")}
                  className="absolute top-1/2 -left-3 transform -translate-y-1/2 text-white bg-[#EAD298] p-3 px-3 rounded-md shadow-lg hover:shadow-2xl transition-shadow duration-300 z-50"
                  disabled={loadingGenre === genre}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="text-lg  text-[#9B2D2D]" />
                </button>

                {/* Right Arrow */}
                <button
                  onClick={() => handleScroll(genre, "right")}
                  className="absolute top-1/2 -right-3 transform -translate-y-1/2 text-white bg-[#EAD298] p-3 px-3 rounded-md shadow-lg hover:shadow-2xl transition-shadow duration-300 z-50"
                  disabled={loadingGenre === genre}
                >
                  <FontAwesomeIcon icon={faArrowRight} className="text-lg text-[#9B2D2D]" />
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
