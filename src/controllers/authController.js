import firebaseAdmin from 'firebase-admin';
import User from '../models/userModel.js'; 
import path from 'path';


const serviceAccount = path.resolve('service-key.json'); 


firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

export const registerOrLoginWithGoogle = async (req, res) => {
  const { token } = req.body; 

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    let user = await User.findOne({ firebaseUid: uid });

    if (user) {
      return res.status(200).json({ message: "User logged in successfully", user });
    }

    user = new User({
      firebaseUid: uid,
      email: decodedToken.email,
    });

    await user.save();

    res.status(200).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error during registration/login with Google:", error);
    res.status(400).json({ message: "Error during Google authentication", error: error.message });
  }
};

