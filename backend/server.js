// server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "../src/routes/authRoutes.js";
import libraryRoutes from "../src/routes/libraryRoutes.js"
import myProfileRoutes from "../src/routes/myProfleRoutes.js"
import User from '../src/models/userModel.js';



dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const app = express();
const PORT = process.env.PORT || 5001;




// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cors());



// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", libraryRoutes);
app.use("/api/users", myProfileRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
