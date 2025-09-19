// server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import authRoutes from "../src/routes/authRoutes.js";
import libraryRoutes from "../src/routes/libraryRoutes.js";
import myProfileRoutes from "../src/routes/myProfleRoutes.js";
import axios from "axios";
import User from "../src/models/userModel.js";

dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const app = express();
const PORT = process.env.PORT || 5001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cors());


app.use(express.static(path.join(__dirname, "..", "dist")));

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", libraryRoutes);
app.use("/api/users", myProfileRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
