const mongoose = require('mongoose');

const healthMetricSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  heartRate: Number,
  bloodPressure: String,
  bodyTemperature: Number,
  spo2: Number,
  respiratoryRate: Number,
  bloodGlucoseLevel: Number,
  averageSleepHours: Number,
  weight: Number,
  height: Number,
  age: Number,
  timestamp: { type: Date, default: Date.now },
  prediction: String,
});

const HealthMetric = mongoose.model('HealthMetric', healthMetricSchema);

module.exports = HealthMetric;
