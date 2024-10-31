// Update UI based on login status
function updateUI(isLoggedIn) {
  //console.log('updateUI called with isLoggedIn:', isLoggedIn);
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const profileBtn = document.getElementById('profile-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const userMgmtBtn = document.getElementById('userMgmt-btn');
  const contentMgmtBtn = document.getElementById('contentMgmt-btn');
  const healthFormSection = document.getElementById('health-form-section');
  const userRole = localStorage.getItem('userRole');

  //console.log('User role from localStorage:', userRole);

  var isAdmin;
  userRole == 'admin' ? (isAdmin = true) : (isAdmin = false);

  if (loginBtn) loginBtn.style.display = isLoggedIn ? 'none' : 'block';
  if (registerBtn) registerBtn.style.display = isLoggedIn ? 'none' : 'block';
  if (profileBtn) profileBtn.style.display = isLoggedIn ? 'block' : 'none';
  if (userMgmtBtn) userMgmtBtn.style.display = isAdmin ? 'block' : 'none';
  if (contentMgmtBtn) contentMgmtBtn.style.display = isAdmin ? 'block' : 'none';
  if (logoutBtn) logoutBtn.style.display = isLoggedIn ? 'block' : 'none';
  if (healthFormSection) {
    healthFormSection.style.display = isLoggedIn ? 'block' : 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  //console.log('DOMContentLoaded event fired - initial setup');
  const isLoggedIn = !!localStorage.getItem('userId');
  updateUI(isLoggedIn);
});

document.getElementById('login-btn').addEventListener('click', () => {
  window.location.href = 'login.html';
});

// Function to handle login and store user ID
async function loginUser(credentials) {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    console.log('Response data:', data);

    if (data.userId) {
      console.log('User role received:', data.role);
      localStorage.setItem('userId', data.userId); // Store user ID
      localStorage.setItem('userRole', data.role); // Store user role
      updateUI(true); // Update UI to logged-in state
      console.log('User logged in successfully!');

      // Redirect to the home page
      navigateTo('index');
      console.log('Navigating to index.html');
    } else {
      console.error('Login failed:', data.error);
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
}

// Navigate to a specific page
function navigateTo(page) {
  window.location.href = `/${page}.html`;
}

// Setup logout functionality
async function logout() {
  try {
    await fetch('http://127.0.0.1:5000/api/users/logout', { method: 'POST' });
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    console.log('User logged out successfully!');
    updateUI(false); // Update UI to reflect logged-out state
    window.location.href = 'index.html'; // Redirect to home page
  } catch (error) {
    console.error('Error during logout:', error);
  }
}
window.logout = logout;

// Load user profile data
async function loadUserProfile() {
  const userId = localStorage.getItem('userId');
  if (!userId) return;

  try {
    const response = await fetch(
      `http://127.0.0.1:5000/api/health/${userId}/history`
    );
    const historyData = await response.json();

    const historyContainer = document.getElementById('health-history');
    if (historyContainer) {
      historyContainer.innerHTML = ''; // Clear previous data

      historyData.forEach((record) => {
        const recordElement = document.createElement('div');
        recordElement.innerText = `Date: ${record.date}, Heart Rate: ${record.heartRate}, Blood Pressure: ${record.bloodPressure}`;
        historyContainer.appendChild(recordElement);
      });
    }
  } catch (error) {
    console.error('Error fetching health history:', error);
  }
}

// Attach profile load event to profile button
document.addEventListener('DOMContentLoaded', () => {
  const profileBtn = document.getElementById('profile-btn');
  if (profileBtn) {
    profileBtn.addEventListener('click', loadUserProfile);
  }
});

// Setup health form listener
function setupHealthFormListener() {
  const healthForm = document.getElementById('health-form');
  if (healthForm) {
    healthForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const healthMetrics = {
        userId: localStorage.getItem('userId'),
        heartRate: document.getElementById('heartRate').value,
        bloodPressure: document.getElementById('bloodPressure').value,
        bodyTemperature: document.getElementById('bodyTemperature').value,
        spo2: document.getElementById('spo2').value,
        respiratoryRate: document.getElementById('respiratoryRate').value,
        bloodGlucoseLevel: document.getElementById('bloodGlucoseLevel').value,
        averageSleepHours: document.getElementById('averageSleepHours').value,
        weight: document.getElementById('weight').value,
        height: document.getElementById('height').value,
        age: document.getElementById('age').value,
      };

      try {
        // Submit health data
        const response = await fetch('http://127.0.0.1:5000/api/health/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(healthMetrics),
        });

        const result = await response.json();
        const resultElement = document.getElementById('result');
        if (resultElement) {
          resultElement.innerText = result.message;
        }

        // Make prediction
        const predictionResponse = await fetch(
          'http://127.0.0.1:5000/api/health/predict',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(healthMetrics),
          }
        );

        const predictionResult = await predictionResponse.json();
        const predictionElement = document.getElementById('prediction-result');
        if (predictionElement) {
          predictionElement.innerText = `🔍Prediction: ${predictionResult.prediction}`;
        }

        const tipsList = document.getElementById('tips-result');
        if (tipsList) {
          tipsList.innerHTML = ''; // Clear previous tips
          tipsList.innerHTML = '💡Tips for Health Life:';
          predictionResult.tips.forEach((tip) => {
            const listItem = document.createElement('li');
            listItem.innerText = tip;
            tipsList.appendChild(listItem);
          });
        }
      } catch (error) {
        console.error('Error:', error);
        const resultElement = document.getElementById('result');
        if (resultElement) {
          resultElement.innerText =
            'Error submitting health data or making prediction';
        }
      }
    });
  }
}

// Initialize the health form listener when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  //console.log('DOMContentLoaded event fired - setupHealthFormListener');
  setupHealthFormListener();
});
