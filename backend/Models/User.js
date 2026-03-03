// backend/model/User.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// ✅ SAFE export for serverless (prevents crash)
const UserModel =
  mongoose.models.users || mongoose.model("users", UserSchema);

export default UserModel;
