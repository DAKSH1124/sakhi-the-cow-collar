"use client";

import { useEffect, useState } from "react";
import { format, isPast, isToday } from "date-fns";
import { AlertCircle, Syringe, Newspaper, Plus, Loader2, Calendar, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AlertsPage() {
  const [data, setData] = useState<{ systemAlerts: any[], vaccinations: any[], news: any[] } | null>(null);
  const [cows, setCows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Form State
  const [cowId, setCowId] = useState("");
  const [vacName, setVacName] = useState("");
  const [nextDueDate, setNextDueDate] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [alertsRes, cowsRes] = await Promise.all([
        fetch("/api/alerts"),
        fetch("/api/cows")
      ]);
      
      if (alertsRes.ok && cowsRes.ok) {
        setData(await alertsRes.json());
        setCows(await cowsRes.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddVaccination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cowId) {
      toast.error("Please select a cow");
      return;
    }
    
    setIsAdding(true);
    try {
      const res = await fetch("/api/vaccinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cowId,
          name: vacName,
          nextDueDate: new Date(nextDueDate).toISOString(),
          status: "Pending"
        }),
      });

      if (!res.ok) throw new Error("Failed to add vaccination");

      toast.success("Vaccination schedule added!");
      setOpen(false);
      setCowId("");
      setVacName("");
      setNextDueDate("");
      fetchData();
      router.refresh();
    } catch (error) {
      toast.error("Failed to add record");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts & Hub</h1>
          <p className="text-muted-foreground mt-1">Manage health notifications, vaccinations, and news.</p>
        </div>
      </div>

      <Tabs defaultValue="vaccinations" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[600px] mb-8">
          <TabsTrigger value="vaccinations" className="flex items-center gap-2">
            <Syringe className="h-4 w-4" /> Vaccinations
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> System Alerts
            {data?.systemAlerts && data.systemAlerts.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                {data.systemAlerts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" /> Cattle News
          </TabsTrigger>
        </TabsList>

        {/* VACCINATIONS TAB */}
        <TabsContent value="vaccinations" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Upcoming Schedules</h2>
            <Dialog open={open} onOpenChange={setOpen}>
                <Button className="flex items-center gap-2" onClick={() => setOpen(true)}>
                  <Plus className="h-4 w-4" /> Add Record
                </Button>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Vaccination Schedule</DialogTitle>
                  <DialogDescription>
                    Schedule an upcoming vaccination for a specific cow.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddVaccination}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="cowId">Select Cow</Label>
                      <Select value={cowId} onValueChange={(val) => setCowId(val || "")} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a cow" />
                        </SelectTrigger>
                        <SelectContent>
                          {cows.map(cow => (
                            <SelectItem key={cow.id} value={cow.id}>
                              #{cow.id} {cow.name ? `(${cow.name})` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vacName">Vaccine Name</Label>
                      <Input id="vacName" placeholder="e.g. FMD / Brucellosis" value={vacName} onChange={(e) => setVacName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Next Due Date</Label>
                      <Input id="dueDate" type="date" value={nextDueDate} onChange={(e) => setNextDueDate(e.target.value)} required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isAdding}>
                      {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Schedule
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <Skeleton className="h-[200px] w-full rounded-xl" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data?.vaccinations.map((vac) => {
                const dueDate = new Date(vac.nextDueDate);
                const isUrgent = isPast(dueDate) || isToday(dueDate);
                
                return (
                  <Card key={vac.id} className={isUrgent ? "border-destructive/50 bg-destructive/5" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge variant={vac.status === "Completed" ? "default" : isUrgent ? "destructive" : "secondary"}>
                          {vac.status === "Completed" ? "Completed" : isUrgent ? "Overdue/Due" : "Scheduled"}
                        </Badge>
                        <Syringe className={`h-5 w-5 ${isUrgent ? 'text-destructive' : 'text-muted-foreground'}`} />
                      </div>
                      <CardTitle className="text-xl mt-2">{vac.name}</CardTitle>
                      <CardDescription className="text-sm font-medium">
                        Cow #{vac.cow.collarId} {vac.cow.name ? `(${vac.cow.name})` : ""}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm mt-4 space-x-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Due: <strong className={isUrgent ? "text-destructive" : "text-foreground"}>{format(dueDate, "PPP")}</strong></span>
                      </div>
                      {vac.status !== "Completed" && (
                        <Button variant="outline" className="w-full mt-4" size="sm">
                          <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Done
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
              {(!data?.vaccinations || data.vaccinations.length === 0) && (
                <div className="col-span-full py-12 text-center border rounded-xl border-dashed">
                  <Syringe className="h-10 w-10 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-lg font-medium">No Vaccinations Scheduled</h3>
                  <p className="text-muted-foreground mt-1">Keep track of your herd's health by adding vaccination records.</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* ALERTS TAB */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>System & Health Alerts</CardTitle>
              <CardDescription>Automated warnings generated by the Sakhi Smart Collars.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-40 w-full" />
              ) : data?.systemAlerts && data.systemAlerts.length > 0 ? (
                <div className="space-y-4">
                  {data.systemAlerts.map(alert => (
                    <div key={alert.id} className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                      <div className={`p-2 rounded-full ${alert.severity === 'Critical' ? 'bg-destructive/10 text-destructive' : 'bg-orange-500/10 text-orange-500'}`}>
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold">{alert.type} Alert - Cow #{alert.cow.collarId}</h4>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(alert.timestamp), "MMM d, h:mm a")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-lg font-medium">No Active Alerts</h3>
                  <p className="text-muted-foreground mt-1">Your herd is currently safe and healthy.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* NEWS TAB */}
        <TabsContent value="news">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              [1, 2, 3].map(i => <Skeleton key={i} className="h-[250px] w-full rounded-xl" />)
            ) : (
              data?.news.map(article => (
                <Card key={article.id} className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group">
                  <div className="h-40 bg-muted flex items-center justify-center border-b relative">
                    {/* Placeholder for image */}
                    <Newspaper className="h-10 w-10 text-muted-foreground opacity-20 group-hover:scale-110 transition-transform" />
                    <Badge className="absolute top-4 left-4" variant="secondary">{article.category}</Badge>
                  </div>
                  <CardHeader>
                    <div className="text-xs text-muted-foreground mb-2 flex justify-between">
                      <span>{article.source}</span>
                      <span>{format(new Date(article.date), "MMM d, yyyy")}</span>
                    </div>
                    <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {article.summary}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
