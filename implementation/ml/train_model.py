import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.model_selection import GridSearchCV
from imblearn.over_sampling import SMOTE
import joblib
import os

script_dir = os.path.dirname(os.path.abspath(__file__))

csv_path = os.path.join(script_dir, 'synthetic_health_data.csv')

data = pd.read_csv(csv_path)

X = data[['heartRate', 'bloodPressureSystolic', 'bloodPressureDiastolic', 'bodyTemperature', 'spo2', 'respiratoryRate', 'bloodGlucoseLevel', 'averageSleepHours', 'weight', 'height', 'age']]
y = data['health_issue']

# # Check for unique health issues in your dataset
# print(data['health_issue'].unique())

# # Check the distribution of health issues
# print(data['health_issue'].value_counts())

# Applying SMOTE for balancing the classes
sm = SMOTE(random_state=42, k_neighbors=5)
X_res, y_res = sm.fit_resample(X, y)

# Check new class distribution
# print("New class distribution after SMOTE:\n", pd.Series(y_res).value_counts())

# Splitting balanced data
X_train, X_test, y_train, y_test = train_test_split(X_res, y_res, test_size=0.2, random_state=42)

# Set up the parameter grid
param_grid = {
    'n_estimators': [100, 200],
    'max_depth': [10, 15],
    'min_samples_split': [2, 5],
    'min_samples_leaf': [1, 2]
}

# Create a model with GridSearchCV
grid_search = GridSearchCV(
    RandomForestClassifier(random_state=42, class_weight='balanced'),
    param_grid,
    cv=5,
    scoring='f1_weighted'
)
grid_search.fit(X_train, y_train)

# Best model
best_model = grid_search.best_estimator_
y_pred = best_model.predict(X_test)

# Evaluation
# print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))
# print("Classification Report:\n", classification_report(y_test, y_pred))

# Save the model
model_path = os.path.join(script_dir, 'health_model.pkl')
joblib.dump(best_model, model_path)
