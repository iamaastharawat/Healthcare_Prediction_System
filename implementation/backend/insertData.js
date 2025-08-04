const mongoose = require('mongoose');
// const { HealthTip } = require('./models/models');
const HealthTip = require('./models/tipModel');
const User  = require('./models/userModel');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/config.env' });

const tips = [
  {
    condition: 'healthy',
    tips: [
      'Maintain a balanced diet with a variety of nutrients.',
      'Exercise regularly to stay fit and active.',
      'Get regular health check-ups to monitor your well-being.',
      'Stay hydrated by drinking at least 2 liters of water daily.',
    ],
  },
  {
    condition: 'heart_disease',
    tips: [
      'Avoid saturated fats and high cholesterol foods.',
      'Exercise moderately, such as walking or swimming.',
      'Manage stress through meditation and relaxation techniques.',
      'Take prescribed medications regularly and monitor your heart health.',
    ],
  },
  {
    condition: 'diabetes',
    tips: [
      'Monitor blood glucose levels frequently.',
      'Eat high-fiber foods and avoid sugary drinks.',
      'Engage in physical activities to manage weight.',
      'Take insulin or prescribed medication as recommended by your doctor.',
    ],
  },
  {
    condition: 'hypertension',
    tips: [
      'Reduce salt intake in your meals.',
      'Engage in regular physical activities like brisk walking.',
      'Limit alcohol consumption and avoid smoking.',
      'Monitor blood pressure regularly and manage stress levels.',
    ],
  },
  {
    condition: 'respiratory_issue',
    tips: [
      'Avoid exposure to pollution and allergens.',
      'Use prescribed inhalers or medications as needed.',
      'Practice breathing exercises to strengthen your lungs.',
      'Stay hydrated and avoid respiratory infections.',
    ],
  },
  {
    condition: 'fever/infection',
    tips: [
      'Get plenty of rest to help your body recover.',
      'Drink fluids frequently to stay hydrated.',
      'Take over-the-counter medications if recommended by your doctor.',
      'Monitor body temperature and seek medical care if necessary.',
    ],
  },
  {
    condition: 'asthma',
    tips: [
      'Avoid allergens and triggers like dust or pollen.',
      'Use inhalers as prescribed and keep them handy.',
      'Engage in light physical activities to improve lung health.',
      'Monitor symptoms and seek medical care during severe episodes.',
    ],
  },
  {
    condition: 'obesity',
    tips: [
      'Follow a healthy diet plan with portion control.',
      'Engage in regular physical activities like jogging or yoga.',
      'Monitor weight regularly to track progress.',
      'Seek professional guidance for a sustainable weight-loss plan.',
    ],
  },
  {
    condition: 'sleep_disorder',
    tips: [
      'Maintain a consistent sleep schedule every day.',
      'Avoid caffeine and heavy meals before bedtime.',
      'Create a comfortable sleeping environment free from distractions.',
      'Practice relaxation techniques to improve sleep quality.',
    ],
  },
  {
    condition: 'anemia',
    tips: [
      'Consume iron-rich foods like spinach and red meat.',
      'Take iron supplements as recommended by your doctor.',
      'Avoid drinking tea or coffee with meals to improve iron absorption.',
      'Get regular blood tests to monitor hemoglobin levels.',
    ],
  },
  {
    condition: 'hypotension',
    tips: [
      'Drink plenty of fluids to prevent dehydration.',
      'Add more salt to your diet if recommended by your doctor.',
      'Avoid standing up quickly from sitting or lying positions.',
      'Wear compression stockings to improve blood flow.',
    ],
  },
];

// Function to insert health tips
async function insertHealthTips() {
  try {
    // Clear existing data
    await HealthTip.deleteMany({});
    // Insert new tips
    await HealthTip.insertMany(tips);
    console.log('Health tips data inserted successfully');
  } catch (error) {
    console.error('Error inserting health tips:', error);
  }
}

// Function to create an admin user
async function createAdminUser() {
  try {
    // Hash the admin password
    const hashedPassword = await bcrypt.hash('admin_password', 10);

    const existingAdmin = await User.findOne({
      username: 'admin',
      role: 'admin',
    });
    if (existingAdmin) {
      console.log('Admin user already exists.');
    } else {
      const adminUser = new User({
        username: 'admin',
        password: hashedPassword,
        gender: 'Male',
        role: 'admin',
      });
      await adminUser.save();
      console.log('Admin user created successfully.');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Connect to MongoDB, insert tips and admin, and close the connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('Connected to MongoDB');
    await insertHealthTips();
    await createAdminUser();
  })
  .finally(() => {
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
