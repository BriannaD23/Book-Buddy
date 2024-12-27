import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  firebaseUid: { type: String, required: false },
  library: [
    {
      title: { type: String, required: true },
      author: { type: String, required: true },
      genre: { type: String },
      publishedYear: { type: Number },
    }
  ],
});

const User = mongoose.model("User", userSchema);

export default User;
