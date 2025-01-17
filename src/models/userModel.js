// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String },
//   firebaseUid: { type: String, required: false },
//   library: [
//     {
//       coverImage:{ type: String }
//     }
//   ],
// });

// const User = mongoose.model("User", userSchema);

// export default User;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  firebaseUid: { type: String, required: false },
  library: {
    mybooks: [
      {
        coverImage: { type: String },
        bookId: { type: String, required: true },
      },
    ],
    current: [
      {
        coverImage: { type: String },
        title: { type: String },
        author: { type: String },
        pages: { type: Number }, 
        progress: { type: Number, min: 0 }, 
        startDate: { type: Date }, 
        endDate: { type: Date }, 
      },
    ],
    pending: [
      {
        coverImage: { type: String },
        bookId: { type: String, required: true },
      },
    ],
    completed: {
      books: [
        {
          coverImage: { type: String },
          title: { type: String },
          author: { type: String },
          completionDate: { type: Date },
          rating: { type: Number, min: 0, max: 5 },
        },
      ],
      totalBooks: { type: Number, default: 0 }, 
    },
  },
});

const User = mongoose.model("User", userSchema);

export default User;
