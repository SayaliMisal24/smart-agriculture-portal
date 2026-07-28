const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['farmer', 'admin'],
      default: 'farmer',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profilePhoto: {
      type: String,
      default: '',
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('User', userSchema);