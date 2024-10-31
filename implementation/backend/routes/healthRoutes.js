const express = require('express');
const router = express.Router();
const HealthMetric = require('../models/healthMetricModel');
const User = require('../models/userModel');
const HealthTip = require('../models/tipModel');
const mongoose = require('mongoose');
const { exec } = require('child_process');
const { timeStamp } = require('console');

// Add health metrics
// Add health metrics
router.post('/add', async (req, res) => {
  const {
    userId, // This should match the logged-in user's ID
    heartRate,
    bloodPressure,
    bodyTemperature,
    spo2,
    respiratoryRate,
    bloodGlucoseLevel,
    averageSleepHours,
    weight,
    height,
    age,
  } = req.body;

  try {
    // Check if userId exists in the users DB
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Extract systolic and diastolic values from bloodPressure string
    const [systolic, diastolic] = bloodPressure.split('/').map(Number);

    // Prepare the input for the ML model
    const inputFeatures = {
      heartRate: Number(heartRate),
      bloodPressureSystolic: systolic,
      bloodPressureDiastolic: diastolic,
      bodyTemperature: Number(bodyTemperature),
      spo2: Number(spo2),
      respiratoryRate: Number(respiratoryRate),
      bloodGlucoseLevel: Number(bloodGlucoseLevel),
      averageSleepHours: Number(averageSleepHours),
      weight: Number(weight),
      height: Number(height),
      age: Number(age),
    };

    // Run the prediction script
    exec(
      'python3 ./implementation/ml/predict.py',
      {
        env: { ...process.env, ...inputFeatures }, // Pass features as environment variables
      },
      async (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing the script: ${error.message}`);
          return res.status(500).json({ error: 'Error making prediction' });
        }
        if (stderr) {
          console.error(`Script stderr: ${stderr}`);
          return res.status(500).json({ error: 'Error making prediction' });
        }

        // Parse stdout to get the prediction
        const prediction = stdout.trim();

        // Save the health metric with the prediction
        const newHealthMetric = new HealthMetric({
          userId: new mongoose.Types.ObjectId(userId),
          heartRate,
          bloodPressure,
          bodyTemperature,
          spo2,
          respiratoryRate,
          bloodGlucoseLevel,
          averageSleepHours,
          weight,
          height,
          age,
          prediction, // Save the prediction
        });

        await newHealthMetric.save();
        res
          .status(201)
          .json({ message: 'Health data added successfully!', prediction });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error adding health data' });
  }
});

// Predict health condition
router.post('/predict', async (req, res) => {
  const {
    heartRate,
    bloodPressure,
    bodyTemperature,
    spo2,
    respiratoryRate,
    bloodGlucoseLevel,
    averageSleepHours,
    weight,
    height,
    age,
  } = req.body;

  // Extract systolic and diastolic values from bloodPressure string
  const [systolic, diastolic] = bloodPressure.split('/').map(Number);

  // Prepare the input for the ML model
  const inputFeatures = {
    heartRate: Number(heartRate),
    bloodPressureSystolic: systolic,
    bloodPressureDiastolic: diastolic,
    bodyTemperature: Number(bodyTemperature),
    spo2: Number(spo2),
    respiratoryRate: Number(respiratoryRate),
    bloodGlucoseLevel: Number(bloodGlucoseLevel),
    averageSleepHours: Number(averageSleepHours),
    weight: Number(weight),
    height: Number(height),
    age: Number(age),
  };

  try {
    // Run the prediction script
    exec(
      'python3 ./implementation/ml/predict.py',
      {
        env: { ...process.env, ...inputFeatures }, // Pass features as environment variables
      },
      async (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing the script: ${error.message}`);
          return res.status(500).json({ error: 'Error making prediction' });
        }
        if (stderr) {
          console.error(`Script stderr: ${stderr}`);
          return res.status(500).json({ error: 'Error making prediction' });
        }

        // Log stdout for debugging
        console.log(`Python script output: ${stdout}`);

        // Parse stdout to get the prediction
        const prediction = stdout.trim();

        try {
          // Fetch tips based on the prediction from the database
          const healthTip = await HealthTip.findOne({ condition: prediction });

          // If no tips found, send a default message
          const tips = healthTip
            ? healthTip.tips
            : ['No tips available for this condition.'];

          // Send the prediction and tips back to the frontend
          res.status(200).json({ prediction, tips });
        } catch (dbError) {
          console.error('Error fetching tips:', dbError);
          res.status(500).json({ error: 'Error retrieving health tips' });
        }
      }
    );
  } catch (err) {
    console.error('Error during prediction:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get health metrics history
router.get('/:userId/history', async (req, res) => {
  const { userId } = req.params;

  try {
    const healthHistory = await HealthMetric.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).sort({ timestamp: -1 });

    res.status(200).json(healthHistory);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching health history' });
  }
});

module.exports = router;
