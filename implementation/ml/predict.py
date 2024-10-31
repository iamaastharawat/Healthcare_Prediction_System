import joblib
import numpy as np
import os
import pandas as pd 

model_path = os.path.join(os.path.dirname(__file__), 'health_model.pkl')
model = joblib.load(model_path)

def predict_health_condition(metrics):
    input_data = pd.DataFrame([{
        'heartRate': metrics['heartRate'],
        'bloodPressureSystolic': metrics['bloodPressureSystolic'],
        'bloodPressureDiastolic': metrics['bloodPressureDiastolic'],
        'bodyTemperature': metrics['bodyTemperature'],
        'spo2': metrics['spo2'],
        'respiratoryRate': metrics['respiratoryRate'],
        'bloodGlucoseLevel': metrics['bloodGlucoseLevel'],
        'averageSleepHours': metrics['averageSleepHours'],
        'weight': metrics['weight'],
        'height': metrics['height'],
        'age': metrics['age']
    }])
    
    prediction = model.predict(input_data)
    return prediction[0]

if __name__ == "__main__":
    metrics = {
        'heartRate': float(os.environ.get('heartRate')),
        'bloodPressureSystolic': float(os.environ.get('bloodPressureSystolic')),
        'bloodPressureDiastolic': float(os.environ.get('bloodPressureDiastolic')),
        'bodyTemperature': float(os.environ.get('bodyTemperature')),
        'spo2': float(os.environ.get('spo2')),
        'respiratoryRate': float(os.environ.get('respiratoryRate')),
        'bloodGlucoseLevel': float(os.environ.get('bloodGlucoseLevel')),
        'averageSleepHours': float(os.environ.get('averageSleepHours')),
        'weight': float(os.environ.get('weight')),
        'height': float(os.environ.get('height')),
        'age': float(os.environ.get('age')),
    }

    prediction = predict_health_condition(metrics)
    print(prediction)
