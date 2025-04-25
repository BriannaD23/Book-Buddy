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
app.use("/api/users", libraryRoutes); const updateCompletedBooks = async () => {
  try {
    const users = await User.find();

    for (let user of users) {
      if (user.library?.completed) {
        let updated = false;
        user.library.completed = user.library.completed.map((book) => {
          if (!book.title || !book.author) {
            updated = true;
            return {
              ...book,
              title: book.title || "Unknown Title",
              author: book.author || "Unknown Author",
            };
          }
          return book;
        });

        if (updated) {
          await user.save();
          console.log(`Updated user ${user._id}`);
        }
      }
    }

    console.log("Completed books updated successfully.");
  } catch (error) {
    console.error("Error updating completed books:", error);
  }
};

// const updateMyBooks = async () => {
//   try {
//     // No need to reconnect here, as mongoose is already connected via server.js

//     const users = await User.find();

//     for (let user of users) {
//       if (user.library?.mybooks) {
//         let updated = false;
//         user.library.mybooks = user.library.mybooks.map((book) => {
//           // Check for missing fields and add default values
//           if (!book.title || !book.author) {
//             updated = true;
//             return {
//               ...book,
//               title: book.title || "Unknown Title",
//               author: book.author || "Unknown Author",
//             };
//           }
//           return book;
//         });

//         if (updated) {
//           await user.save();
//           console.log(`Updated user ${user._id}'s mybooks`);
//         }
//       }
//     }

//     console.log("MyBooks section updated successfully.");
//   } catch (error) {
//     console.error("Error updating mybooks:", error);
//   }
// };

// updateMyBooks();


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
