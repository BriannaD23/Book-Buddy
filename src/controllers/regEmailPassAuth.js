
import User from "../models/userModel.js";
import { generateToken } from "../utils/jwtUtils.js"


export const registerWithEmail = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ email, password }); // Consider hashing the password with bcrypt
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Error during registration", error: error.message });
  }
};


export const loginWithEmail = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password matches (use bcrypt for hashed passwords)
    const isPasswordValid = password === user.password; // Replace with bcrypt.compare for hashed passwords

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a token
    const token = generateToken({ userId: user._id });
    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error during login", error: error.message });
  }
};


// import bcrypt from "bcrypt";
// import User from "../models/userModel.js";

// const SALT_ROUNDS = 10; 


// export const registerWithEmail = async (req, res) => {
//   const { email, password } = req.body;

//   try {
    
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already in use" });
//     }


//     const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    
//     const newUser = new User({
//       email,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully", user: newUser });
//   } catch (error) {
//     console.error("Error registering user:", error);
//     res.status(500).json({ message: "Error registering user" });
//   }
// };

// // Log in an existing user
// export const loginWithEmail = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // Compare the provided password with the hashed password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // Login successful
//     res.status(200).json({ message: "User logged in successfully", user });
//   } catch (error) {
//     console.error("Error logging in user:", error);
//     res.status(500).json({ message: "Error logging in user" });
//   }
// };
