import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
  phone: String,
  google_access_token: String,
  google_refresh_token: String,
  token_expires_at: Number,
});

export default mongoose.models.User || mongoose.model("User", userSchema);
