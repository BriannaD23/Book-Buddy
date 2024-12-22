// authRoutes.js
import express from "express";
import { registerOrLoginWithGoogle} from "../controllers/authController.js";  
import { registerWithEmail} from "../controllers/regEmailPassAuth.js";  
import { loginWithEmail} from "../controllers/regEmailPassAuth.js";  




const router = express.Router();

// Routes for email/password authentication
router.post("/register", registerWithEmail);
router.post("/login", loginWithEmail);

// Route for Google authentication
router.post("/google", registerOrLoginWithGoogle);

export default router;



