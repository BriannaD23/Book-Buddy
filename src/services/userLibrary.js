import { decodeTokenPayload } from "../utils/cookieUtils.js";

const API_URL = "http://localhost:5001/api/users";

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
    const title = volumeInfo.title || "Unknown Title";
    const author = volumeInfo.authors ? volumeInfo.authors.join(", ") : "Unknown Author";

    console.log("Full volumeInfo:", volumeInfo);

    console.log("Extracted coverImage:", coverImage);
    console.log("Extracted title:", title);
    console.log("Extracted authors:", author);

    return { coverImage, title, author };
  } catch (error) {
    console.error(
      "Error fetching book details from Google Books API:",
      error.message
    );
    throw error;
  }
};

// ---------------------------Library section --------------------------------------------------------//
export const addBookToLibrary = async (bookId) => {
  try {
    console.log("Starting addBookToLibrary function with bookId:", bookId);

    const { coverImage,title,author } = await fetchBookDetailsFromGoogle(bookId);
    console.log("Fetched book details:", { coverImage,title ,author});

    const decodedPayload = decodeTokenPayload();
    console.log("Decoded token payload:", decodedPayload);

    if (!decodedPayload?.userId) {
      throw new Error("No userId found in the token");
    }

    const { userId, token } = decodedPayload;

    const newBook = { bookId, coverImage , title, author  };
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

export const addBookToCurrentFromLibrary = async (
  bookId,
  coverImage,
  title,
  author,
  pages,
  progress,
  startDate,
  endDate
) => {
  try {
    const decodedPayload = decodeTokenPayload();
    if (!decodedPayload?.userId) {
      throw new Error("No userId found in the token");
    }
    const { userId, token } = decodedPayload;

    const currentBook = {
      bookId,
      coverImage,
      title,
      author,
      pages,
      progress,
      startDate,
      endDate,
    };

    const response = await fetch(`${API_URL}/${userId}/library/current`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(currentBook),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add book to current: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding book to current:", error.message);
    throw error;
  }
};

export const updateCurrentBookFromLibrary = async (
  bookId,
  coverImage,
  title,
  author,
  pages,
  progress,
  startDate,
  endDate
) => {
  try {
    if (!bookId || !coverImage) {
      throw new Error("Missing required parameters: bookId or coverImage");
    }

    const decodedPayload = decodeTokenPayload();
    if (!decodedPayload?.userId) {
      throw new Error("No userId found in the token");
    }
    const { userId, token } = decodedPayload;

    const currentBook = {
      bookId,
      coverImage,
      title,
      author,
      pages,
      progress,
      startDate,
      endDate,
    };

    console.log("Prepared currentBook payload:", currentBook);

    const response = await fetch(`${API_URL}/${userId}/library/current`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(currentBook),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update current book: ${errorText}`);
    }

    const data = await response.json();
    console.log("Book successfully updated in current list:", data);

    return data;
  } catch (error) {
    console.error("Error updating current book:", error.message);
    alert(`Error: ${error.message}`);
    throw error;
  }
};

export const addBookToCompleted = async (bookId, coverImage, title, author) => {
  try {
    if (!bookId || !coverImage || !title || !author) {
      throw new Error("Missing required parameters: bookId or coverImage");
    }

    const decodedPayload = decodeTokenPayload();
    if (!decodedPayload?.userId) {
      throw new Error("No userId found in the token");
    }

    const { userId, token } = decodedPayload;

    const completedBook = { bookId, coverImage, title, author };
    console.log("Payload to send:", completedBook);

    const response = await fetch(`${API_URL}/${userId}/library/completed`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(completedBook),
      }
    );

    console.log("API Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from server:", errorText);
      throw new Error(`Failed to add book to completed: ${errorText}`);
    }
    const data = await response.json();
    console.log("Response data:", data);

    return data;
  } catch (error) {
    console.error("Error adding book to completed:", error.message);
    throw error;
  }
};


export const  fetchCompletedBooks = async () => {
  try {
    const decodedPayload = decodeTokenPayload();

    if (!decodedPayload?.userId) {
      throw new Error("No userId found in the token");
    }

    const { userId, token } = decodedPayload;

    console.log("Fetching library for userId:", userId);

    const response = await fetch(`${API_URL}/${userId}/library/completed`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch pending books');
    }

    const data = await response.json();
    
    
    return data.completedBooks || [];  
  } catch (error) {
    console.error('Error fetching pending books:', error.message);
    throw error;
  }
};

export const updateGoal = async (goal) => {
  try {
    const decodedPayload = decodeTokenPayload();

    if (!decodedPayload?.userId) {
      throw new Error("No userId found in the token");
    }

    const { userId, token } = decodedPayload;

    console.log("Fetching library for userId:", userId);

    const response = await fetch(`${API_URL}/${userId}/library/goal`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({goal})

    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update goal');
    }

    const data = await response.json();
    
    
    return data.goal;  
  } catch (error) {
    console.error('Error fetching pending books:', error.message);
    throw error;
  }
};

export const getGoal = async () => {
  try {
    const decodedPayload = decodeTokenPayload(); 
    if (!decodedPayload?.userId) {
      throw new Error("No userId found in the token");
    }

    const { userId, token } = decodedPayload;
    console.log("Decoded payload get goal:", decodedPayload);

    console.log("Fetching goal for userId:", userId);

    const response = await fetch(`${API_URL}/${userId}/library/goal`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch goal");
    }

    const data = await response.json();
    console.log("Backend returned:", data);
    return data.goal ?? 0; 
  } catch (error) {
    console.error("Error fetching goal:", error.message);
    throw error;
  }
};





// ---------------------------Pending section --------------------------------------------------------//
export const fetchCurrentBookFromLibrary = async () => {
  try {
    console.log("Decoding token...");
    const decodedPayload = decodeTokenPayload();

    if (!decodedPayload?.userId) {
      console.error("No userId found in the token");
      throw new Error("No userId found in the token");
    }

    const { userId, token } = decodedPayload;
    console.log("Decoded userId:", userId);

    console.log("Fetching current book for userId:", userId);
    const response = await fetch(`${API_URL}/${userId}/library/current`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch current book:", errorText);
      throw new Error(`Failed to fetch current book: ${errorText}`);
    }

    const data = await response.json();
    console.log("Full Current Book Data:", data); // Log the entire response for debugging

   
    if (data?.currentBook && typeof data.currentBook === 'object') {
      console.log("Current book found:", data.currentBook);
      return data.currentBook; 
    } else {
      console.error("No currentBook field or incorrect data structure:", data);
      throw new Error("No currentBook field or incorrect data structure.");
    }

  } catch (error) {
    console.error("Error fetching current book:", error.message);
    throw error;
  }
};


export const addBookToPending = async (bookId, coverImage, title, author) => {
  try {
    if (!bookId || !coverImage) {
      throw new Error("Missing required parameters: bookId or coverImage");
    }

    const decodedPayload = decodeTokenPayload();

    if (!decodedPayload?.userId) {
      throw new Error("No userId found in the token");
    }

    const { userId, token } = decodedPayload;

    const pendingBook = {
      bookId,
      coverImage,
      title,
      author 
    };
    console.log("Prepared pendingBook payload:", pendingBook);

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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch pending books');
    }

    const data = await response.json();
    
    
    return data.pendingBooks || [];  
  } catch (error) {
    console.error('Error fetching pending books:', error.message);
    throw error;
  }
};


// ---------------------------Delete section --------------------------------------------------------//




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

    console.log("Attempting to delete book with ID:", _id); 


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
    console.log("Server response result:", result); 
    return result;
  } catch (error) {
    console.error('Error deleting library book:', error);
    throw error;
  }
};

export const deleteCompletedBooks = async (_id) => {
  try {
    const decodedPayload = decodeTokenPayload();
    if (!decodedPayload?.userId) {
      throw new Error("No userId found in the token");
    }

    const { userId, token } = decodedPayload;

    console.log("Attempting to delete book with ID:", _id); 


    const response = await fetch(`${API_URL}/${userId}/library/completed/${_id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete the book from completed');
    }

    const result = await response.json();
    console.log("Server response result:", result); 
    return result;
  } catch (error) {
    console.error('Error deleting library book:', error);
    throw error;
  }
};




export const deleteCurrentBook = async (bookId) => {
  try {
    const decodedPayload = decodeTokenPayload();
    if (!decodedPayload?.userId) {
      throw new Error("No userId found in the token");
    }

    const { userId, token } = decodedPayload;

    const response = await fetch(`${API_URL}/${userId}/library/current/${bookId}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete the book from current');
    }

    const result = await response.json();

    if (result.message === "Current book successfully removed.") {
      return {
        success: true,
        currentBook: result.currentBook, // This will contain bookId and coverImage as null
      };
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error deleting current book from the library:', error);
    return {
      success: false,
      message: error.message,
    };
  }
};
