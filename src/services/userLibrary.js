import { decodeTokenPayload } from "../utils/cookieUtils.js";

const API_URL = "http://localhost:5000/api/users";

// Fetch book details from Google Books API
const fetchBookDetailsFromGoogle = async (bookId) => {
  try {
    console.log(
      "Fetching book details from Google Books API for bookId:",
      bookId
    );

    const apiKey = import.meta.env.VITE_API_KEY;
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`
    );

    console.log("Google Books API response status:", response.status);

    if (!response.ok) {
      throw new Error("Failed to fetch book details from Google Books API");
    }

    const data = await response.json();
    console.log("Google Books API response data:", data);

    const { volumeInfo } = data;

    const coverImage = volumeInfo.imageLinks?.thumbnail || null;

    console.log("Extracted coverImage:", coverImage);

    return { coverImage };
  } catch (error) {
    console.error(
      "Error fetching book details from Google Books API:",
      error.message
    );
    throw error;
  }
};
export const addBookToLibrary = async (bookId) => {
  try {
    console.log("Starting addBookToLibrary function with bookId:", bookId);

    const { coverImage } = await fetchBookDetailsFromGoogle(bookId);
    console.log("Fetched book details:", { coverImage });

    const decodedPayload = decodeTokenPayload();
    console.log("Decoded token payload:", decodedPayload);

    if (!decodedPayload?.userId) {
      throw new Error("No userId found in the token");
    }

    const { userId, token } = decodedPayload;

    const newBook = { bookId, coverImage };
    console.log("Prepared newBook payload:", newBook);

    const response = await fetch(`${API_URL}/${userId}/library/mybooks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newBook),
    });

    console.log("Add to Library API response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Add Book Error Response:", errorData);
      throw new Error(errorData.message || "Failed to add the book.");
    }

    const data = await response.json();
    console.log("Book successfully added to myBooks:", data);
    return data;
  } catch (error) {
    console.error("Error adding book to library:", error.message);
  }
};

export const getLibrary = async () => {
  try {
    console.log("Starting getLibrary function");

    const decodedPayload = decodeTokenPayload();

    if (!decodedPayload?.userId) {
      throw new Error("No userId found in the token");
    }

    const { userId, token } = decodedPayload;

    console.log("Fetching library for userId:", userId);

    const response = await fetch(`${API_URL}/${userId}/library/mybooks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Get Library API response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Get Library Error Response:", errorData);
      throw new Error(errorData.message || "Failed to fetch the library.");
    }

    const libraryData = await response.json();
    console.log("Fetched library data:", libraryData);

    const myBooks = libraryData || [];
    console.log("Extracted myBooks:", myBooks);

    return myBooks;
  } catch (error) {
    console.error("Error fetching library:", error.message);
    return [];
  }
};

// Pending section --------------------------------------------------------//

// export const addBookToPending = async (bookId, bookCover) => {
//   try {
//     // Validate required parameters
//     if (!bookId || !bookCover) {
//       throw new Error("Missing required parameters: bookId or bookCover");
//     }

//     const decodedPayload = decodeTokenPayload();

//     if (!decodedPayload?.userId) {
//       throw new Error("No userId found in the token");
//     }

//     const { userId, token } = decodedPayload;

//     // Construct the payload for the API request
//     const pendingBook = {
//       bookId,
//       bookCover,
//     };
//     console.log("Prepared pendingBook payload:", pendingBook);

//     // Make the POST request to the backend
//     const response = await fetch(`${API_URL}/${userId}/library/pending`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(pendingBook),
//     });

//     console.log("Add to Pending API response status:", response.status);

//     // Handle non-OK response
//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Failed to add book to pending: ${errorText}`);
//     }

//     // Parse and return the response data
//     const data = await response.json();
//     console.log("Book successfully added to pending list:", data);

//     return data;
//   } catch (error) {
//     console.error("Error adding book to pending:", error.message);
//     throw error;
//   }
// };

export const addBookToPending = async (bookId, coverImage) => {
  try {
    // Validate required parameters
    if (!bookId || !coverImage) {
      throw new Error("Missing required parameters: bookId or coverImage");
    }

    const decodedPayload = decodeTokenPayload();

    if (!decodedPayload?.userId) {
      throw new Error("No userId found in the token");
    }

    const { userId, token } = decodedPayload;

    // Construct the payload for the API request
    const pendingBook = {
      bookId,
      coverImage, // Changed from bookCover to coverImage
    };
    console.log("Prepared pendingBook payload:", pendingBook);

    // Make the POST request to the backend
    const response = await fetch(`${API_URL}/${userId}/library/pending`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pendingBook),
    });

    console.log("Add to Pending API response status:", response.status);

    // Handle non-OK response
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add book to pending: ${errorText}`);
    }

    // Parse and return the response data
    const data = await response.json();
    console.log("Book successfully added to pending list:", data);

    return data;
  } catch (error) {
    console.error("Error adding book to pending:", error.message);
    throw error;
  }
};


export const fetchPendingBooks = async () => {
  try {
    const decodedPayload = decodeTokenPayload();

    if (!decodedPayload?.userId) {
      throw new Error("No userId found in the token");
    }

    const { userId, token } = decodedPayload;

    console.log("Fetching library for userId:", userId);

    const response = await fetch(`${API_URL}/${userId}/library/pending`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if the response is not OK
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch pending books');
    }

    // Parse the response to JSON
    const data = await response.json();
    
    // Return the pending books from the parsed data
    return data.pendingBooks || [];  // Assuming the API returns `pendingBooks`
  } catch (error) {
    console.error('Error fetching pending books:', error.message);
    throw error;
  }
};

export const deletePendingBook = async (_id) => {
  try {
    const decodedPayload = decodeTokenPayload();
    if (!decodedPayload?.userId) {
      throw new Error("No userId found in the token");
    }

    const { userId, token } = decodedPayload;

    const response = await fetch(`${API_URL}/${userId}/library/pending/${_id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete the book');
    }

    const result = await response.json();
    console.log("Server response result:", result); // Debug line
    return result;
  } catch (error) {
    console.error('Error deleting pending book:', error);
    throw error;
  }
};

export const deleteMyLibraryBook = async (_id) => {
  try {
    const decodedPayload = decodeTokenPayload();
    if (!decodedPayload?.userId) {
      throw new Error("No userId found in the token");
    }

    const { userId, token } = decodedPayload;

    console.log("Attempting to delete book with ID:", _id); // Debug line


    const response = await fetch(`${API_URL}/${userId}/library/mybooks/${_id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete the book from My Library');
    }

    const result = await response.json();
    console.log("Server response result:", result); // Debug line
    return result;
  } catch (error) {
    console.error('Error deleting library book:', error);
    throw error;
  }
};



