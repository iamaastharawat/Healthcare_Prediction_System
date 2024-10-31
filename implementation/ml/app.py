import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from flask import Flask, request, jsonify
import joblib
from predict import predict_health_condition  

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    input_features = [
        data['heartRate'],
        data['bloodPressure'],
        data['bodyTemperature'],
        data['spo2'],
        data['respiratoryRate'],
        data['bloodGlucoseLevel'],
        data['averageSleepHours'],
        data['weight'],
        data['height'],
        data['age'],
    ]
    prediction = predict_health_condition(input_features)  
    return jsonify({'prediction': prediction[0]})

if __name__ == '__main__':
    app.run(port=5001) 
