import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    voterId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    faceEncoding: {
      type: String,
      default: ""
    },
    fingerprintId: {
      type: String,
      default: ""
    },
    hasVoted: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ["citizen", "admin"],
      default: "citizen"
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
