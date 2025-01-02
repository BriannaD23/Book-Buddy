import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

// export const generateToken = (userId) => {
//   const payload = { _id: userId };  // Include the userId (as _id) in the payload
//   return jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
// };

export const generateToken = (userId) => {
  const payload = { userId };  // Directly include userId in the payload
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "4h" });
};


export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY); 
    return decoded; 
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error("Token has expired");
    } else {
      throw new Error("Invalid token");
    }
  }
};