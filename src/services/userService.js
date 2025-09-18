import { decodeTokenPayload } from "../utils/cookieUtils.js";
const API_URL = "http://localhost:5001/api/users";

export const getUserProfile = async () => {
  const decodedPayload = decodeTokenPayload();
  const { userId, token } = decodedPayload;

  const response = await fetch(`${API_URL}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to fetch user profile");

  const data = await response.json();
  return data.user;
};

export const updateProfilePic = async (userId, photoURL) => {
  try {
    const token = decodeTokenPayload()?.token; // get token from cookie or storage
    if (!token) throw new Error("No token found");

    const response = await fetch(`${API_URL}/${userId}/photoURL`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ photoURL }), 
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update profile picture: ${errorText}`);
    }

    const data = await response.json();
    return data.user; 
  } catch (error) {
    console.error("Error updating profile pic:", error.message);
    throw error;
  }
};



export const updateName = async (userId, name) => {
  try {
    const token = decodeTokenPayload()?.token; 
    if (!token) throw new Error("No token found");

    const response = await fetch(`${API_URL}/${userId}/name`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }), 
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update name: ${errorText}`);
    }

    const data = await response.json();
    return data.user; 
  } catch (error) {
    console.error("Error updating name:", error.message);
    throw error;
  }
};

