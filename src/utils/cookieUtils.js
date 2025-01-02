// import { getCookie } from "../utils/getCookies.js";

// export const decodeTokenPayload = () => {
//   const token = getCookie("token");  // Assuming you are getting the token from cookies
//   if (!token) {
//     console.error("No token found in cookies");
//     return null;
//   }

//   try {
//     const payloadBase64 = token.split(".")[1];
//     const decodedPayload = JSON.parse(atob(payloadBase64));

//     // Log the decoded payload to inspect the structure
//     console.log("Decoded Token Payload:", decodedPayload);

//     // Check if _id is an object and access the correct value
//     const userId = decodedPayload._id && decodedPayload._id.$oid ? decodedPayload._id.$oid : null;

//     if (!userId) {
//       console.error("No valid userId found in the token payload");
//       return null;
//     }

//     // Return the token and userId
//     return { token, userId };
//   } catch (error) {
//     console.error("Invalid token:", error.message);
//     return null;
//   }
// };

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

    // Access userId inside _id
    const userId = decodedPayload._id?.userId || null;

    if (!userId) {
      console.error("No valid userId found in the token payload");
      return null;
    }

    // Return the token and userId
    return { token, userId };
  } catch (error) {
    console.error("Invalid token:", error.message);
    return null;
  }
};
