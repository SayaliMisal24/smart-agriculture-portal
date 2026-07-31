const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    sizeInAcres: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Farm', farmSchema);