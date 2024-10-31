import numpy as np
import pandas as pd
import os

# Number of synthetic data points
n = 5000  

# Generate synthetic data with relationships
heartRate = np.random.normal(loc=72, scale=10, size=n).clip(60, 100)
bloodPressureSystolic = np.random.normal(loc=120, scale=15, size=n).clip(90, 200)
bloodPressureDiastolic = np.random.normal(loc=80, scale=10, size=n).clip(60, 120)
bodyTemperature = np.random.normal(loc=98.6, scale=1.5, size=n).clip(97.7, 104.5)
spo2 = np.random.uniform(90, 100, size=n)
respiratoryRate = np.random.normal(loc=16, scale=2, size=n).clip(12, 30)
bloodGlucoseLevel = np.random.normal(loc=100, scale=15, size=n).clip(70, 180)
averageSleepHours = np.random.uniform(4, 10, size=n)
weight = np.random.normal(loc=70, scale=15, size=n).clip(30, 150)
height = np.random.normal(loc=170, scale=10, size=n).clip(140, 200)
age = np.random.randint(18, 90, size=n)

health_issues = []

# Generate health issues based on feature values
for i in range(n):
    if bloodPressureSystolic[i] > 140 or bloodPressureDiastolic[i] > 90:
        health_issues.append('hypertension')
    elif bloodGlucoseLevel[i] > 126:
        health_issues.append('diabetes')
    elif (weight[i] / (height[i] / 100) ** 2) >= 30:
        health_issues.append('obesity')
    elif age[i] > 65 and (bloodPressureSystolic[i] > 130 or weight[i] > 85):
        health_issues.append('heart_disease')
    elif weight[i] > 80 and averageSleepHours[i] < 6:
        health_issues.append('sleep_disorder')
    elif (bodyTemperature[i] > 99.5):
        health_issues.append('fever/infection')
    elif age[i] < 30 and spo2[i] < 95:
        health_issues.append('respiratory_issue')
    elif weight[i] < 50 and bloodGlucoseLevel[i] < 70:  
        health_issues.append('anemia')  
    elif weight[i] < 70 and age[i] > 60:
        health_issues.append('hypotension')  
    elif (respiratoryRate[i] > 20 or spo2[i] < 95) and np.random.rand() > 0.8:
        health_issues.append('asthma')
    else:
        health_issues.append('healthy')

# Adding additional conditions to increase anemia cases as it was less frequent
for i in range(n):
    if health_issues[i] == 'healthy' and np.random.rand() < 0.1:  # 10% chance to convert healthy to anemia
        health_issues[i] = 'anemia' if weight[i] < 50 else health_issues[i]

# Create DataFrame
data = {
    'heartRate': heartRate,
    'bloodPressureSystolic': bloodPressureSystolic,
    'bloodPressureDiastolic': bloodPressureDiastolic,
    'bodyTemperature': bodyTemperature,
    'spo2': spo2,
    'respiratoryRate': respiratoryRate,
    'bloodGlucoseLevel': bloodGlucoseLevel,
    'averageSleepHours': averageSleepHours,
    'weight': weight,
    'height': height,
    'age': age,
    'health_issue': health_issues
}

df = pd.DataFrame(data)

script_dir = os.path.dirname(os.path.abspath(__file__))

csv_path = os.path.join(script_dir, 'synthetic_health_data.csv')

df.to_csv(csv_path, index=False)

# # Output the class distribution to verify
# print(df['health_issue'].value_counts())
