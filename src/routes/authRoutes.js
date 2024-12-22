// authRoutes.js
import express from "express";
import { registerOrLoginWithGoogle} from "../controllers/authController.js";  // Ensure 

const router = express.Router();

router.post("/google", registerOrLoginWithGoogle);

export default router;



