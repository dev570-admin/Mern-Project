//Models/User.js 
import mongoose from "mongoose";

const { Schema } = mongoose;
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },
});

// ✅ Export with ES Module syntax
const UserModel = mongoose.model("users", UserSchema);
export default UserModel;
