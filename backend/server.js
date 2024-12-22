// server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "../src/routes/authRoutes.js";



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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// import express from 'express';
// import cors from 'cors';
// import firebaseAdmin from 'firebase-admin';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// dotenv.config();

// // Import the service account JSON file
// import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

// // Initialize Firebase Admin SDK
// firebaseAdmin.initializeApp({
//   credential: firebaseAdmin.credential.cert(serviceAccount),
// });

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());
// app.use(cors());

// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database-name', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log('Connected to MongoDB');
// }).catch((err) => {
//   console.error('MongoDB connection error:', err);
// });

// // MongoDB User Model
// const userSchema = new mongoose.Schema({
//   firebaseUid: { type: String, required: true },
//   email: { type: String, required: true },
// });

// const User = mongoose.model('User', userSchema);

// // POST route to handle Google Sign-In
// app.post('/api/auth/google', async (req, res) => {
//   const { token } = req.body;

//   try {
//     // Verify the ID token received from the frontend
//     const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
//     const uid = decodedToken.uid;

//     // Check if user exists in the database, if not, create a new one
//     let user = await User.findOne({ firebaseUid: uid });

//     if (!user) {
//       user = new User({
//         firebaseUid: uid,
//         email: decodedToken.email,
//       });

//       await user.save(); // Save new user to the database
//     }

//     // Respond with success message
//     res.status(200).json({ message: 'User authenticated', user });

//   } catch (error) {
//     console.error('Error verifying token:', error);
//     res.status(400).json({ message: 'Authentication failed', error: error.message });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
