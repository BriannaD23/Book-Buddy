import React from "react";

const BookList = ({ books }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-6">
      {books.map((book) => (
        <div
          key={book.id}
          className="rounded-lg flex flex-col items-center"
        >
          {/* Book container */}
          <div className="relative w-32 h-48 mb-4">
            {/* Book Back Cover */}
            <div className="absolute inset-0 bg-gray-300 rounded-lg shadow-md transform -translate-x-2 translate-y-2 z-10"></div>

            {/* Book Spine */}
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-gray-600 rounded-lg z-20"></div>

            <img
              src={
                book.volumeInfo.imageLinks?.thumbnail ||
                "https://via.placeholder.com/150"
              }
              alt={book.volumeInfo.title}
              className="w-full h-full object-cover transition-transform duration-300 z-30 relative rounded-lg"  
            />
            
            {/* Optional Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-20 z-40"></div>
          </div>

          {/* Book Title and Author */}
          <div className="text-center mt-4">
            <h3 className="text-[16px] font-semibold mb-2">{book.volumeInfo.title}</h3>
            <p className="text-sm text-gray-600">
              {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookList;
