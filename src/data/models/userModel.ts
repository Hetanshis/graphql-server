import mongoose from "mongoose";

const UserModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      Min: [6],
      required: true,
    },
    contactNumber: {
      type: String,
      Min: [11],
      required: true,
    },
    emailVerify_token: {
      type: String,
    },
    is_Verified: {
      type: Boolean,
      default: false,
    },
    resetPassword_token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", UserModel);
export default User;
