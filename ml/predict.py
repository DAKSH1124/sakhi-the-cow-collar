import os
import joblib
import pandas as pd
import warnings
warnings.filterwarnings('ignore')

# Load models and encoders
print("Loading Models...")
disease_rf = joblib.load("models/disease_rf_model.joblib")
disease_scaler = joblib.load("models/disease_scaler.joblib")
disease_le = joblib.load("models/disease_label_encoders.joblib")
disease_target_le = joblib.load("models/disease_target_encoder.joblib")

milk_rf = joblib.load("models/milk_yield_rf_model.joblib")
milk_scaler = joblib.load("models/milk_scaler.joblib")
milk_le = joblib.load("models/milk_label_encoders.joblib")

# 1. Sample Data for Disease Detection
print("\n--- Testing Disease Detection ---")
sample_cow_disease = pd.DataFrame([{
    'Breed': 'Holstein-Friesian',
    'Region': 'Africa',
    'Climate_Zone': 'Temperate',
    'Management_System': 'Intensive',
    'Age_Months': 48,
    'Weight_kg': 600.5,
    'Parity': 2,
    'Lactation_Stage': 'Mid',
    'Days_in_Milk': 120,
    'Feed_Type': 'Silage',
    'Feed_Quantity_kg': 20.0,
    'Water_Intake_L': 80.0,
    'Walking_Distance_km': 2.5,
    'Grazing_Duration_hrs': 4.0,
    'Rumination_Time_hrs': 8.0,
    'Resting_Hours': 10.0,
    'Body_Temperature_C': 40.5,  # High temp (Fever)
    'Heart_Rate_bpm': 95,      # High HR
    'Respiratory_Rate': 40,
    'Ambient_Temperature_C': 25.0,
    'Humidity_percent': 60.0,
    'Season': 'Summer',
    'Housing_Score': 0.8,
    'Milk_Yield_L': 15.0,
    'FMD_Vaccine': 1,
    'Brucellosis_Vaccine': 1,
    'HS_Vaccine': 1,
    'BQ_Vaccine': 1,
    'Anthrax_Vaccine': 1,
    'IBR_Vaccine': 1,
    'BVD_Vaccine': 1,
    'Rabies_Vaccine': 1,
    'Previous_Week_Avg_Yield': 16.0,
    'Body_Condition_Score': 3.0,
    'Milking_Interval_hrs': 12
}])

# Encode categorical
for col in sample_cow_disease.select_dtypes(include=['object']).columns:
    if col in disease_le:
        # Handle unseen labels gracefully (default to 0 or something safe in prod, here we assume it exists)
        sample_cow_disease[col] = disease_le[col].transform(sample_cow_disease[col].astype(str))

# Scale
X_test_scaled = disease_scaler.transform(sample_cow_disease)

# Predict
pred_idx = disease_rf.predict(X_test_scaled)
disease_prediction = disease_target_le.inverse_transform(pred_idx)[0]

print(f"Symptoms: Temp 40.5C (Fever), HR 95bpm")
print(f"Predicted Health Status: {disease_prediction}")


# 2. Sample Data for Milk Yield Prediction
print("\n--- Testing Milk Yield Prediction ---")
sample_cow_milk = pd.DataFrame([{
    'Breed': 'Holstein-Friesian',
    'Region': 'Africa',
    'Climate_Zone': 'Temperate',
    'Management_System': 'Intensive',
    'Age_Months': 48,
    'Weight_kg': 600.5,
    'Parity': 2,
    'Lactation_Stage': 'Mid',
    'Days_in_Milk': 60,
    'Feed_Type': 'Hay',
    'Feed_Quantity_kg': 25.0,
    'Feeding_Frequency': 3,
    'Water_Intake_L': 100.0,
    'Walking_Distance_km': 1.5,
    'Grazing_Duration_hrs': 2.0,
    'Rumination_Time_hrs': 9.0,
    'Resting_Hours': 12.0,
    'Ambient_Temperature_C': 20.0,
    'Humidity_percent': 50.0,
    'Season': 'Spring',
    'Housing_Score': 0.9,
    'FMD_Vaccine': 1,
    'Brucellosis_Vaccine': 1,
    'HS_Vaccine': 1,
    'BQ_Vaccine': 1,
    'Anthrax_Vaccine': 1,
    'IBR_Vaccine': 1,
    'BVD_Vaccine': 1,
    'Rabies_Vaccine': 1,
    'Previous_Week_Avg_Yield': 28.5,
    'Body_Condition_Score': 3.5,
    'Milking_Interval_hrs': 8
}])

for col in sample_cow_milk.select_dtypes(include=['object']).columns:
    if col in milk_le:
        sample_cow_milk[col] = milk_le[col].transform(sample_cow_milk[col].astype(str))

X_test_milk_scaled = milk_scaler.transform(sample_cow_milk)
milk_prediction = milk_rf.predict(X_test_milk_scaled)[0]

print(f"Cow Profile: Holstein-Friesian, Peak Lactation, TMR Diet")
print(f"Predicted Daily Milk Yield: {milk_prediction:.2f} Liters")
