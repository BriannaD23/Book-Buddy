import React, { useState } from "react";
import { auth, provider } from "../../backend/firebaseConfig.js";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import googleIcon from "../assets/images/google-icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../styles/Loginpage.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const token = await user.getIdToken();

      const response = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate("/logedin-home");
      } else {
        setError("Authentication failed");
      }
    } catch (error) {
      console.error(error);
      setError("Error during login");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate("/logedin-home");
      } else {
        const data = await response.json();
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex page-container items-center justify-center min-h-screen px-4 sm:px-6 md:px-8">
      <div className="login-container bg-black bg-opacity-50 lg:bg-opacity-70 p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md  md:max-w-lg max-w-md">
        <h1 className="text-2xl text-white font-bold mb-4 text-center">
          Login
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form>
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
          <button
            onClick={handleLogin}
            type="submit"
            className="w-full p-2 bg-[#9B2D2D]  text-white rounded-md hover:bg-[#7A1F1F]"
          >
            Login
          </button>
          <button
            onClick={handleGoogleLogin}
            className=" flex items-center justify-center  w-full p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 mt-2"
          >
            <img src={googleIcon} className="pr-2 h-5 mt-1" />{" "}
            <p className="pt-1">Login with Google </p>
          </button>
          <p className="text-center  mt-4 text-white">
            Don't have an account?{" "}
            <a
              href="/registration"
              className="text-yellow-500 hover:text-yellow-600"
            >
              Register here
            </a>
          </p>
          <p className="text-center mt-6">
            <a
              href="/home"
              className="text-white text-sm underline hover:text-yellow-500"
            >
              Continue as Guest
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
