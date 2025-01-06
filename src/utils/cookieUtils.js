import { getCookie } from "../utils/getCookies.js";

export const decodeTokenPayload = () => {
  const token = getCookie("token");  // Assuming you are getting the token from cookies
  if (!token) {
    console.error("No token found in cookies");
    return null;
  }

  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));

    // Log the decoded payload to inspect the structure
    console.log("Decoded Token Payload:", decodedPayload);

    // Access the nested userId correctly
    const userId = decodedPayload.userId?.userId || null; // Access the nested userId

    if (!userId) {
      console.error("No valid userId found in the token payload");
      return null;
    }

    return { token, userId }; // Return the token and userId if valid
  } catch (error) {
    console.error("Invalid token:", error.message);
    return null;
  }
};
