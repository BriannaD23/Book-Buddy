// authRoutes.js
import express from "express";
import { registerOrLoginWithGoogle} from "../controllers/authController.js";  
import { registerWithEmail} from "../controllers/regEmailPassAuth.js";  
import { loginWithEmail} from "../controllers/regEmailPassAuth.js";  
import { getUserById } from "../controllers/userController.js";
import { authenticateUser } from "../middleware/authMiddleware.js"; // Import middleware


const router = express.Router();

// Routes for email/password authentication
router.post("/register", registerWithEmail);
router.post("/login", loginWithEmail);

// Route for Google authentication
router.post("/google", registerOrLoginWithGoogle);



router.get("/user/:id", authenticateUser, getUserById);


export default router;



