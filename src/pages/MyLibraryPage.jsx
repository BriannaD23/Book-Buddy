import { useEffect, useState } from "react";
import { getLibrary } from "../services/userLibrary.js";

const MyLibrary = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLibrary = async () => {
      const library = await getLibrary();
      if (library && library.length > 0) {
        setBooks(library);
      } else {
        console.log("No books found.");
      }
    };

    loadLibrary();
  }, []);

  return (
    <div>
      <h1>My Books</h1>
      {error && <p>{error}</p>}
      <ul>
        {books.length > 0 ? (
          books.map((book, index) => (
            <li key={index}>
              <h2>{book.title}</h2>
              <p>{book.author}</p>
            </li>
          ))
        ) : (
          <p>No books found</p>
        )}
      </ul>
    </div>
  );
};

export default MyLibrary;
