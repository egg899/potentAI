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
    },
    isVerified: { type: Boolean, default: false }, //Campo nuevo para saber si el usuario ha sido verificado
    verificationToken: { type: String, default: null },  // <-- agregar este campo

    // Campos para recuperación de contraseña
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },

  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
