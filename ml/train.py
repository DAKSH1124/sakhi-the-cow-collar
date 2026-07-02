import pandas as pd
import numpy as np
import os
import joblib
import kagglehub
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, classification_report, mean_squared_error, r2_score

print("Downloading dataset...")
path = kagglehub.dataset_download("shahhet2812/cattle-health-and-feeding-data")

disease_path = os.path.join(path, "global_cattle_disease_detection_dataset.csv")
milk_path = os.path.join(path, "global_cattle_milk_yield_prediction_dataset.csv")

# ==========================================
# 1. TRAIN DISEASE DETECTION MODEL
# ==========================================
print("\n--- Training Disease Detection Model ---")
df_disease = pd.read_csv(disease_path)

# Target: Disease_Status
# Drop non-predictive or redundant columns
drop_cols = ['Cattle_ID', 'Date', 'Farm_ID', 'Country']
df_disease = df_disease.drop(columns=drop_cols)

# Separate X and y
X_disease = df_disease.drop(columns=['Disease_Status'])
y_disease = df_disease['Disease_Status']

# Encode Categorical variables
cat_cols = X_disease.select_dtypes(include=['object']).columns
le_dict_disease = {}

for col in cat_cols:
    le = LabelEncoder()
    X_disease[col] = le.fit_transform(X_disease[col].astype(str))
    le_dict_disease[col] = le

# Target Encoder
le_target = LabelEncoder()
y_disease = le_target.fit_transform(y_disease.astype(str))

# Scale numerical features
scaler_disease = StandardScaler()
X_disease_scaled = scaler_disease.fit_transform(X_disease)

# Train/Test split
X_train, X_test, y_train, y_test = train_test_split(X_disease_scaled, y_disease, test_size=0.2, random_state=42)

# Train Model (Using subset of data if huge to save time, but we'll use all here, maybe limit depth)
print("Fitting Random Forest Classifier...")
clf = RandomForestClassifier(n_estimators=50, max_depth=10, random_state=42, n_jobs=-1)
clf.fit(X_train, y_train)

# Evaluate
y_pred = clf.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"Disease Detection Accuracy: {acc:.4f}")

# Save models and encoders
os.makedirs("models", exist_ok=True)
joblib.dump(clf, "models/disease_rf_model.joblib")
joblib.dump(scaler_disease, "models/disease_scaler.joblib")
joblib.dump(le_dict_disease, "models/disease_label_encoders.joblib")
joblib.dump(le_target, "models/disease_target_encoder.joblib")


# ==========================================
# 2. TRAIN MILK YIELD PREDICTION MODEL
# ==========================================
print("\n--- Training Milk Yield Prediction Model ---")
df_milk = pd.read_csv(milk_path)

# Target: Milk_Yield_L
df_milk = df_milk.drop(columns=drop_cols)

X_milk = df_milk.drop(columns=['Milk_Yield_L'])
y_milk = df_milk['Milk_Yield_L']

cat_cols_milk = X_milk.select_dtypes(include=['object']).columns
le_dict_milk = {}

for col in cat_cols_milk:
    le = LabelEncoder()
    X_milk[col] = le.fit_transform(X_milk[col].astype(str))
    le_dict_milk[col] = le

scaler_milk = StandardScaler()
X_milk_scaled = scaler_milk.fit_transform(X_milk)

X_train_m, X_test_m, y_train_m, y_test_m = train_test_split(X_milk_scaled, y_milk, test_size=0.2, random_state=42)

print("Fitting Random Forest Regressor...")
reg = RandomForestRegressor(n_estimators=50, max_depth=10, random_state=42, n_jobs=-1)
reg.fit(X_train_m, y_train_m)

y_pred_m = reg.predict(X_test_m)
rmse = np.sqrt(mean_squared_error(y_test_m, y_pred_m))
r2 = r2_score(y_test_m, y_pred_m)

print(f"Milk Yield RMSE: {rmse:.4f} Liters")
print(f"Milk Yield R2 Score: {r2:.4f}")

joblib.dump(reg, "models/milk_yield_rf_model.joblib")
joblib.dump(scaler_milk, "models/milk_scaler.joblib")
joblib.dump(le_dict_milk, "models/milk_label_encoders.joblib")

print("\nModels saved successfully in ml/models/ directory!")
