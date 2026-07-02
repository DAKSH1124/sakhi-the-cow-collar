"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Activity, Droplets } from "lucide-react";
import { toast } from "sonner";

export default function PredictionsPage() {
  const [loading, setLoading] = useState(false);
  const [milkResult, setMilkResult] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [diseaseResult, setDiseaseResult] = useState<string | null>(null);

  // Core tweakable state for Milk
  const [age, setAge] = useState("48");
  const [weight, setWeight] = useState("600");
  const [feedQty, setFeedQty] = useState("25");
  const [prevYield, setPrevYield] = useState("20");

  // Core tweakable state for Disease
  const [temp, setTemp] = useState("38.5");
  const [heartRate, setHeartRate] = useState("60");
  const [respRate, setRespRate] = useState("25");

  const handlePredictMilk = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMilkResult(null);
    setRecommendations([]);
    try {
      const response = await fetch("http://localhost:8000/optimize/yield", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Age_Months: parseInt(age),
          Weight_kg: parseFloat(weight),
          Feed_Quantity_kg: parseFloat(feedQty),
          Previous_Week_Avg_Yield: parseFloat(prevYield)
        })
      });
      const data = await response.json();
      if (data.success) {
        setMilkResult(data.baseline_yield);
        setRecommendations(data.recommendations || []);
        toast.success("Milk Yield & Optimization Complete!");
      } else {
        toast.error(data.detail || "Prediction failed");
      }
    } catch (err) {
      toast.error("Failed to connect to ML Backend (is FastAPI running?)");
    } finally {
      setLoading(false);
    }
  };

  const handlePredictDisease = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setDiseaseResult(null);
    try {
      const response = await fetch("http://localhost:8000/predict/disease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Body_Temperature_C: parseFloat(temp),
          Heart_Rate_bpm: parseInt(heartRate),
          Respiratory_Rate: parseInt(respRate),
          Age_Months: parseInt(age),
          Weight_kg: parseFloat(weight)
        })
      });
      const data = await response.json();
      if (data.success) {
        setDiseaseResult(data.prediction_status);
        toast.success("Health Status Prediction Complete!");
      } else {
        toast.error(data.detail || "Prediction failed");
      }
    } catch (err) {
      toast.error("Failed to connect to ML Backend (is FastAPI running?)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Smart Predictions (AI)</h1>
        <p className="text-muted-foreground mt-2">
          Leverage our trained Random Forest models to predict daily milk yield and detect potential diseases early.
        </p>
      </div>

      <Tabs defaultValue="milk" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="milk"><Droplets className="w-4 h-4 mr-2" /> Milk Yield</TabsTrigger>
          <TabsTrigger value="disease"><Activity className="w-4 h-4 mr-2" /> Disease Detection</TabsTrigger>
        </TabsList>
        
        {/* MILK YIELD TAB */}
        <TabsContent value="milk">
          <Card>
            <CardHeader>
              <CardTitle>Predict Daily Milk Yield</CardTitle>
              <CardDescription>Adjust the core parameters to simulate different scenarios.</CardDescription>
            </CardHeader>
            <form onSubmit={handlePredictMilk}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Age (Months)</Label>
                    <Input type="number" value={age} onChange={e => setAge(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Feed Quantity (kg/day)</Label>
                    <Input type="number" step="0.1" value={feedQty} onChange={e => setFeedQty(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Previous Week Avg (Liters)</Label>
                    <Input type="number" step="0.1" value={prevYield} onChange={e => setPrevYield(e.target.value)} required />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  * Note: 32 other environmental and historical variables are pre-filled with realistic defaults to simplify testing.
                </p>
                
                {milkResult !== null && (
                  <div className="mt-6 space-y-4">
                    <div className="p-6 bg-primary/10 border border-primary/20 rounded-xl flex flex-col items-center justify-center">
                      <span className="text-sm font-medium text-primary mb-1">Predicted Output</span>
                      <span className="text-4xl font-bold text-primary">{milkResult} <span className="text-xl">Liters</span></span>
                    </div>
                    
                    {recommendations.length > 0 && (
                      <div className="bg-muted/30 border border-border/50 rounded-xl p-5">
                        <h3 className="font-semibold text-sm mb-3 flex items-center">
                          <Activity className="h-4 w-4 mr-2 text-primary" />
                          AI Optimization Recommendations
                        </h3>
                        <div className="space-y-3">
                          {recommendations.map((rec, i) => (
                            <div key={i} className="flex justify-between items-center text-sm p-3 bg-background rounded-lg border border-border/40">
                              <span>{rec.action}</span>
                              <span className="text-green-600 font-semibold">+{rec.expected_yield_increase}L</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Predict Milk Yield
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* DISEASE DETECTION TAB */}
        <TabsContent value="disease">
          <Card>
            <CardHeader>
              <CardTitle>Predict Health Status</CardTitle>
              <CardDescription>Input vital signs to predict if the cow is healthy or at risk of specific diseases.</CardDescription>
            </CardHeader>
            <form onSubmit={handlePredictDisease}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Body Temp (°C)</Label>
                    <Input type="number" step="0.1" value={temp} onChange={e => setTemp(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Heart Rate (bpm)</Label>
                    <Input type="number" value={heartRate} onChange={e => setHeartRate(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Respiratory Rate</Label>
                    <Input type="number" value={respRate} onChange={e => setRespRate(e.target.value)} required />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  * Note: Variables like Breed, Weight, Age, and Housing Score are using defaults.
                </p>
                
                {diseaseResult !== null && (
                  <div className={`mt-6 p-6 rounded-xl flex flex-col items-center justify-center border ${diseaseResult === "Healthy" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                    <span className={`text-sm font-medium mb-1 ${diseaseResult === "Healthy" ? "text-green-700" : "text-red-700"}`}>Predicted Status</span>
                    <span className={`text-3xl font-bold ${diseaseResult === "Healthy" ? "text-green-700" : "text-red-700"}`}>{diseaseResult}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Predict Health Status
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
