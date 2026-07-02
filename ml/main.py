from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import pandas as pd
import os

app = FastAPI(title="Sakhi ML Predictions API")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Models on Startup
models_dir = os.path.join(os.path.dirname(__file__), "models")

try:
    print("Loading Milk Yield Models...")
    milk_rf = joblib.load(os.path.join(models_dir, "milk_yield_rf_model.joblib"))
    milk_scaler = joblib.load(os.path.join(models_dir, "milk_scaler.joblib"))
    milk_le = joblib.load(os.path.join(models_dir, "milk_label_encoders.joblib"))
    
    print("Loading Disease Detection Models...")
    disease_rf = joblib.load(os.path.join(models_dir, "disease_rf_model.joblib"))
    disease_scaler = joblib.load(os.path.join(models_dir, "disease_scaler.joblib"))
    disease_le = joblib.load(os.path.join(models_dir, "disease_label_encoders.joblib"))
    disease_target_le = joblib.load(os.path.join(models_dir, "disease_target_encoder.joblib"))
    print("All models loaded successfully!")
except Exception as e:
    print(f"Error loading models: {e}")


# Define Pydantic models for the requests
class MilkYieldRequest(BaseModel):
    Breed: str = "Holstein-Friesian"
    Region: str = "Africa"
    Climate_Zone: str = "Temperate"
    Management_System: str = "Intensive"
    Age_Months: int = 48
    Weight_kg: float = 600.0
    Parity: int = 2
    Lactation_Stage: str = "Mid"
    Days_in_Milk: int = 120
    Feed_Type: str = "Hay"
    Feed_Quantity_kg: float = 25.0
    Feeding_Frequency: int = 3
    Water_Intake_L: float = 80.0
    Walking_Distance_km: float = 2.0
    Grazing_Duration_hrs: float = 4.0
    Rumination_Time_hrs: float = 8.0
    Resting_Hours: float = 12.0
    Ambient_Temperature_C: float = 25.0
    Humidity_percent: float = 60.0
    Season: str = "Summer"
    Housing_Score: float = 0.8
    FMD_Vaccine: int = 1
    Brucellosis_Vaccine: int = 1
    HS_Vaccine: int = 1
    BQ_Vaccine: int = 1
    Anthrax_Vaccine: int = 1
    IBR_Vaccine: int = 1
    BVD_Vaccine: int = 1
    Rabies_Vaccine: int = 1
    Previous_Week_Avg_Yield: float = 20.0
    Body_Condition_Score: float = 3.0
    Milking_Interval_hrs: int = 12

class DiseaseRequest(BaseModel):
    Breed: str = "Holstein-Friesian"
    Region: str = "Africa"
    Climate_Zone: str = "Temperate"
    Management_System: str = "Intensive"
    Age_Months: int = 48
    Weight_kg: float = 600.0
    Parity: int = 2
    Lactation_Stage: str = "Mid"
    Days_in_Milk: int = 120
    Feed_Type: str = "Hay"
    Feed_Quantity_kg: float = 25.0
    Water_Intake_L: float = 80.0
    Walking_Distance_km: float = 2.0
    Grazing_Duration_hrs: float = 4.0
    Rumination_Time_hrs: float = 8.0
    Resting_Hours: float = 12.0
    Body_Temperature_C: float = 38.5
    Heart_Rate_bpm: int = 60
    Respiratory_Rate: int = 25
    Ambient_Temperature_C: float = 25.0
    Humidity_percent: float = 60.0
    Season: str = "Summer"
    Housing_Score: float = 0.8
    Milk_Yield_L: float = 20.0
    FMD_Vaccine: int = 1
    Brucellosis_Vaccine: int = 1
    HS_Vaccine: int = 1
    BQ_Vaccine: int = 1
    Anthrax_Vaccine: int = 1
    IBR_Vaccine: int = 1
    BVD_Vaccine: int = 1
    Rabies_Vaccine: int = 1
    Previous_Week_Avg_Yield: float = 20.0
    Body_Condition_Score: float = 3.0
    Milking_Interval_hrs: int = 12


@app.post("/predict/yield")
def predict_yield(data: MilkYieldRequest):
    try:
        df = pd.DataFrame([data.dict()])
        
        # Encode
        for col in df.select_dtypes(include=['object']).columns:
            if col in milk_le:
                try:
                    df[col] = milk_le[col].transform(df[col].astype(str))
                except ValueError:
                    # Fallback for unseen labels
                    df[col] = 0
                    
        # Scale & Predict
        X_scaled = milk_scaler.transform(df)
        prediction = milk_rf.predict(X_scaled)[0]
        
        return {"success": True, "prediction_liters": round(float(prediction), 2)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/disease")
def predict_disease(data: DiseaseRequest):
    try:
        df = pd.DataFrame([data.dict()])
        
        # Encode
        for col in df.select_dtypes(include=['object']).columns:
            if col in disease_le:
                try:
                    df[col] = disease_le[col].transform(df[col].astype(str))
                except ValueError:
                    df[col] = 0
                    
        # Scale & Predict
        X_scaled = disease_scaler.transform(df)
        pred_idx = disease_rf.predict(X_scaled)
        prediction = disease_target_le.inverse_transform(pred_idx)[0]
        
        return {"success": True, "prediction_status": str(prediction)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/optimize/yield")
def optimize_yield(data: MilkYieldRequest):
    try:
        base_dict = data.dict()
        
        # 1. Calculate baseline prediction
        def get_prediction(scenario_dict):
            df = pd.DataFrame([scenario_dict])
            for col in df.select_dtypes(include=['object']).columns:
                if col in milk_le:
                    try:
                        df[col] = milk_le[col].transform(df[col].astype(str))
                    except ValueError:
                        df[col] = 0
            X_scaled = milk_scaler.transform(df)
            return milk_rf.predict(X_scaled)[0]

        baseline = get_prediction(base_dict)
        
        # 2. Define simulation scenarios (tweaking actionable variables)
        recommendations = []
        
        # Scenario A: Increase Feed Quantity by 20%
        scen_a = base_dict.copy()
        scen_a['Feed_Quantity_kg'] = base_dict['Feed_Quantity_kg'] * 1.2
        yield_a = get_prediction(scen_a)
        if yield_a > baseline + 0.1:
            recommendations.append({
                "action": f"Increase daily feed quantity by 20% (to {round(scen_a['Feed_Quantity_kg'], 1)}kg)",
                "expected_yield_increase": round(yield_a - baseline, 2)
            })
            
        # Scenario B: Increase Water Intake by 20%
        scen_b = base_dict.copy()
        scen_b['Water_Intake_L'] = base_dict['Water_Intake_L'] * 1.2
        yield_b = get_prediction(scen_b)
        if yield_b > baseline + 0.1:
            recommendations.append({
                "action": f"Increase daily water intake by 20% (to {round(scen_b['Water_Intake_L'], 1)}L)",
                "expected_yield_increase": round(yield_b - baseline, 2)
            })
            
        # Scenario C: Increase Resting Hours by 2 hours
        scen_c = base_dict.copy()
        if base_dict['Resting_Hours'] < 14:
            scen_c['Resting_Hours'] = base_dict['Resting_Hours'] + 2.0
            yield_c = get_prediction(scen_c)
            if yield_c > baseline + 0.1:
                recommendations.append({
                    "action": f"Increase resting time by 2 hours (to {round(scen_c['Resting_Hours'], 1)} hours)",
                    "expected_yield_increase": round(yield_c - baseline, 2)
                })
                
        # Scenario D: Better Housing Score
        scen_d = base_dict.copy()
        if base_dict['Housing_Score'] < 0.9:
            scen_d['Housing_Score'] = 1.0
            yield_d = get_prediction(scen_d)
            if yield_d > baseline + 0.1:
                recommendations.append({
                    "action": "Improve housing conditions (ventilation/cleanliness) to maximum score",
                    "expected_yield_increase": round(yield_d - baseline, 2)
                })

        # Sort recommendations by highest yield increase
        recommendations = sorted(recommendations, key=lambda x: x['expected_yield_increase'], reverse=True)
        
        return {
            "success": True, 
            "baseline_yield": round(float(baseline), 2),
            "recommendations": recommendations[:3] # Top 3
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
