import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../../backend/firebaseConfig.js";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import googleIcon from "../assets/images/google-icon.png";
import "../styles/Loginpage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleGoogleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const token = await user.getIdToken();

      const response = await fetch("http://localhost:5001/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        navigate("/");
      } else {
        setError("Google registration failed");
      }
    } catch (error) {
      setError("Error during Google registration");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        navigate("/");
      } else {
        const text = await response.text(); 
        console.error("Error Response Text:", text);
        setError("Registration failed: " + text); 
      }
    } catch (error) {
      setError("Registration failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  
 
  return (
    <div className="flex items-center page-container justify-center min-h-screen px-4 sm:px-6 md:px-8">
      <div className="register-container  bg-black bg-opacity-50 lg:bg-opacity-65 p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md  md:max-w-lg max-w-md">
        <h1 className="text-2xl text-white font-bold mb-4 text-center">
          Register
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-white">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-white">
              Password:
            </label>
            <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"} 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <FontAwesomeIcon
                icon={passwordVisible ? faEyeSlash : faEye} 
                onClick={() => setPasswordVisible(!passwordVisible)} 
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-white">
              Confirm Password:
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"} 
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <FontAwesomeIcon
                icon={passwordVisible ? faEyeSlash : faEye}
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-[#9B2D2D] text-white rounded-md hover:bg-[#7A1F1F]"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <button
            onClick={handleGoogleRegister}
            className="flex items-center justify-center w-full p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 mt-2"
          >
            <img src={googleIcon} className="pr-2 h-5 mt-1" />
            <p className="pt-1">Register with Google</p>
          </button>
          <p className="text-center text-white mt-4">
            Already have an account?{" "}
            <a href="/" className="text-yellow-500 hover:text-yellow-600">
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
