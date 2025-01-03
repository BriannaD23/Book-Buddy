

// const MyLibrary = () => {
//   const [books, setBooks] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const loadLibrary = async () => {
//       try {
//         const library = await getLibrary(); // Fetch the library from the backend
//         console.log("Loaded Library:", library); // Debugging log
//         setBooks(library); // Always set books
//       } catch (err) {
//         console.error("Error loading library:", err.message);
//         setError(err.message); // Set error message in case of failure
//       }
//     };

//     loadLibrary(); // Call the function to load the library
//   }, []);

//   return (
//     <div>
//       <h1>My Books</h1>
//       {error && <p>{error}</p>} {/* Show error message if any */}
//       <ul>
//         {books.length > 0 ? (
//           books.map((book, index) => (
//             <li key={book._id || index}> {/* Use a unique key */}
//               <h2>{book.title}</h2>
//               <p>{book.author}</p>
//             </li>
//           ))
//         ) : (
//           <p>No books found</p> // Adjust message for empty library
//         )}
//       </ul>
//     </div>
//   );
// };

// export default MyLibrary;

import { useEffect, useState } from "react";
import { getLibrary } from "../services/userLibrary.js";

const MyLibrary = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const loadLibrary = async () => {
      try {
        setLoading(true); // Set loading to true when fetching library
        const library = await getLibrary(); // Fetch the library from the backend
        console.log("Loaded Library:", library); // Debugging log
        setBooks(library); 
      } catch (err) {
        console.error("Error loading library:", err.message);
        setError(err.message);
      } finally {
        setLoading(false); 
      }
    };

    loadLibrary(); // Call the function to load the library
  }, []);

  return (
    <div>
      <h1>My Books</h1>
      {loading ? (
        <p>Loading books...</p> // Display loading text while fetching data
      ) : error ? (
        <p>{error}</p> // Show error message if any
      ) : (
        <ul>
          {books.length > 0 ? (
            books.map((book, index) => (
              <li key={book._id || index}> {/* Use a unique key */}
                <h2>{book.title}</h2>
                <p>{book.author}</p>
                {book.coverImage ? (
                  <img 
                    src={book.coverImage} 
                    alt={book.title} 
                    style={{ width: "100px", height: "150px", objectFit: "cover" }} // Optional styling for cover image
                  />
                ) : (
                  <p>No cover image available</p> // Fallback text if no cover image
                )}
              </li>
            ))
          ) : (
            <p>No books found</p> // Adjust message for empty library
          )}
        </ul>
      )}
    </div>
  );
};

export default MyLibrary;
