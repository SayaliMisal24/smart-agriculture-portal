const mongoose = require('mongoose');

const storedFileSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true, unique: true },
    contentType: String,
    data: Buffer,
  },
  { timestamps: true }
);

module.exports = mongoose.model('StoredFile', storedFileSchema);