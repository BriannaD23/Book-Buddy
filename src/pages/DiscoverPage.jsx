
// import { useEffect, useState } from "react";

// const DiscoverPage = () => {
//   const [booksByGenre, setBooksByGenre] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Updated genres
//   const GENRES = [
//     "manga",
//     "self-help",
//     "action",
//     "fantasy",
//     "drama",
//     "nonfiction",
//   ];
//     const fetchBooksByGenre = async (genre) => {
//       let allBooks = [];
//       let startIndex = 0;
  
//       try {
//         // Continue fetching until we reach the limit or no more results
//         const API_KEY = import.meta.env.VITE_API_KEY; // Ensure your .env file contains this key

//         while (true) {
//           const response = await fetch(
//             `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&maxResults=10&key=${API_KEY}`
//           );
  
//           if (!response.ok) {
//             throw new Error(`Failed to fetch books for genre: ${genre}`);
//           }
  
//           const data = await response.json();
//           const books = data.items || [];
  
//           // Append the fetched books to the list
//           allBooks = [...allBooks, ...books];
  
//           // Check if we need to fetch more (if we got less than 40 results)
//           if (books.length < 40) {
//             break; // No more books to fetch for this genre
//           }
  
//           // Move to the next page
//           startIndex += 40;
//         }
  
//         return { genre, books: allBooks };
//       } catch (err) {
//         console.error(err);
//         throw err;
//       }
//     };
  
//     useEffect(() => {
//       const loadBooks = async () => {
//         try {
//           setLoading(true);
  
//           // Fetch books for each genre
//           const promises = GENRES.map((genre) => fetchBooksByGenre(genre));
//           const results = await Promise.all(promises);
  
//           // Group books by genre
//           const groupedBooks = results.reduce((acc, { genre, books }) => {
//             acc[genre] = books;
//             return acc;
//           }, {});
  
//           setBooksByGenre(groupedBooks);
//         } catch (err) {
//           setError("Failed to load books.");
//         } finally {
//           setLoading(false);
//         }
//       };
  
//     loadBooks();
//   }, []);

//   return (
//     <div className="p-5">
//       <h1 className="text-3xl font-bold mb-5">Discover Books</h1>
//       {loading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p>{error}</p>
//       ) : (
//         <div>
//           {Object.entries(booksByGenre).map(([genre, books]) => (
//             <div key={genre} className="mb-10">
//               <h2 className="text-2xl font-semibold mb-4 capitalize">
//                 {genre}
//               </h2>
//               <div className="flex gap-4 overflow-x-auto">
//                 {books.map((book) => (
//                   <div
//                     key={book.id}
//                     className="w-40 flex-shrink-0 text-center"
//                   >
//                     {book.volumeInfo.imageLinks?.thumbnail ? (
//                       <img
//                         src={book.volumeInfo.imageLinks.thumbnail}
//                         alt={book.volumeInfo.title}
//                         className="rounded-lg mb-2 w-full h-60 object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-60 bg-gray-200 rounded-lg flex items-center justify-center">
//                         No Image
//                       </div>
//                     )}
//                     <p className="text-sm font-medium">
//                       {book.volumeInfo.title}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DiscoverPage;
import { useEffect, useState } from "react";

const DiscoverPage = () => {
  const [booksByGenre, setBooksByGenre] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingGenre, setLoadingGenre] = useState("");
  const [error, setError] = useState(null);

  const GENRES = [
    "manga",
    "self-help",
    "fantasy",
    "drama",
    "nonfiction",
  ];

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

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Discover Books</h1>
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
              <div className="flex gap-4 overflow-x-auto">
                {booksByGenre[genre].map((book) => (
                  <div key={book.id} className="w-40 flex-shrink-0 text-center">
                    {book.volumeInfo.imageLinks?.thumbnail ? (
                      <img
                        src={book.volumeInfo.imageLinks.thumbnail}
                        alt={book.volumeInfo.title}
                        className="rounded-lg mb-2 w-full h-60 object-cover"
                      />
                    ) : (
                      <div className="w-full h-60 bg-gray-200 rounded-lg flex items-center justify-center">
                        No Image
                      </div>
                    )}
                    <p className="text-sm font-medium">
                      {book.volumeInfo.title}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No books available for this genre.</p>
            )}
            <button
              onClick={() => handleLoadMore(genre)}
              className="mt-4 text-blue-500"
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
