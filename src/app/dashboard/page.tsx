"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Heart, ShieldAlert, ThermometerSun, Map as MapIcon, Battery } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

// Dummy chart data for pulse history (can be replaced by real DB history later)
const chartData = [
  { time: "00:00", pulse: 62 },
  { time: "04:00", pulse: 65 },
  { time: "08:00", pulse: 70 },
  { time: "12:00", pulse: 75 },
  { time: "16:00", pulse: 72 },
  { time: "20:00", pulse: 68 },
  { time: "24:00", pulse: 63 },
];

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
    
    // Auto refresh every 10 seconds for real-time feel
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) {
    return <div className="p-8 space-y-4"><Skeleton className="h-10 w-[200px]" /><Skeleton className="h-[200px] w-full" /></div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cattle</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCattle}</div>
            <p className="text-xs text-muted-foreground">Active collars synced</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
            <Heart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.healthyCows}</div>
            <p className="text-xs text-muted-foreground">{Math.round((stats.healthyCows/stats.totalCattle)*100)}% of herd</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.criticalCows}</div>
            <p className="text-xs text-muted-foreground">Needs immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Temperature</CardTitle>
            <ThermometerSun className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgTemp}°C</div>
            <p className="text-xs text-muted-foreground">Normal range</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Average Herd Pulse</CardTitle>
            <CardDescription>BPM over the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip />
                  <Area type="monotone" dataKey="pulse" stroke="var(--primary)" fillOpacity={1} fill="url(#colorPulse)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Latest notifications from collars.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.recentAlerts.map((alert: any) => (
                <div key={alert.id} className="flex items-center">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                    alert.severity === "Critical" ? "bg-destructive/20 text-destructive" :
                    alert.severity === "Warning" ? "bg-orange-500/20 text-orange-500" :
                    "bg-primary/20 text-primary"
                  }`}>
                    {alert.type === "Temperature" ? <ThermometerSun className="h-5 w-5" /> :
                     alert.type === "GeoFence" ? <MapIcon className="h-5 w-5" /> :
                     alert.type === "Battery" ? <Battery className="h-5 w-5" /> :
                     <Activity className="h-5 w-5" />}
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {stats.recentAlerts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No recent alerts</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
