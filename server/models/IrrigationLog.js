const mongoose = require('mongoose');

const irrigationLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    date: { type: Date, required: true }, // the date irrigation was actually done
  },
  { timestamps: true }
);

module.exports = mongoose.model('IrrigationLog', irrigationLogSchema);