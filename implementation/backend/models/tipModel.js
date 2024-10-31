const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
  condition: { type: String, required: true },
  tips: { type: [String], required: true },
});

const HealthTip = mongoose.model('Tip', tipSchema);

module.exports = HealthTip;
