// server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "../src/routes/authRoutes.js";
import libraryRoutes from "../src/routes/libraryRoutes.js"
import User from '../src/models/userModel.js';



dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const app = express();
const PORT = process.env.PORT || 5000;



// Middleware
app.use(express.json());
app.use(cors());



// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", libraryRoutes);

// const updateCurrentBook = async () => {
//   try {
//     const users = await User.find();

//     for (let user of users) {
//       if (user.library?.current) {
//         let updated = false;
//         const current = user.library.current;

//         if (!current.title || !current.author) {
//           updated = true;
//           user.library.current = {
//             ...current,
//             title: current.title || "Unknown Title",
//             author: current.author || "Unknown Author",
//           };
//         }

//         if (updated) {
//           await user.save();
//           console.log(`Updated user ${user._id}`);
//         }
//       }
//     }

//     console.log("Current book updated successfully.");
//   } catch (error) {
//     console.error("Error updating current book:", error);
//   }
// };

// updateCurrentBook(); // Make sure this is called after defining it

const updatePendingBooks = async () => {
  try {
    const users = await User.find();

    for (let user of users) {
      if (user.library?.pending) {
        let updated = false;

        // Loop through each pending book and update missing title and author
        user.library.pending = user.library.pending.map((pendingBook) => {
          if (!pendingBook.title || !pendingBook.author) {
            updated = true;

            // Log to check the book being updated
            console.log('Updating pending book:', pendingBook);

            return {
              ...pendingBook,
              title: pendingBook.title || "Unknown Title",
              author: pendingBook.author || "Unknown Author",
            };
          }
          return pendingBook;
        });

        if (updated) {
          // Save the user with updated pending books
          await user.save();
          console.log(`Updated user ${user._id}'s pending books`);
        }
      }
    }

    console.log("Pending books updated successfully.");
  } catch (error) {
    console.error("Error updating pending books:", error);
  }
};

// Call the function to update pending books
updatePendingBooks();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
