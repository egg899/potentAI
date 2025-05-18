import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
    userType: { 
      type: String, 
      required: true,
      enum: ['job_seeker', 'employer'],
      default: 'job_seeker'
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
