"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Plus, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function CowsPage() {
  const [cows, setCows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Form State
  const [collarId, setCollarId] = useState("");
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");

  const fetchCows = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cows");
      if (res.ok) {
        const data = await res.json();
        setCows(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCows();
  }, []);

  const handleAddCow = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    
    try {
      const res = await fetch("/api/cows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collarId, name, breed, age, weight }),
      });

      if (!res.ok) {
        throw new Error("Failed to add cow");
      }

      toast.success("Cow registered successfully!");
      setOpen(false);
      
      // Reset form
      setCollarId("");
      setName("");
      setBreed("");
      setAge("");
      setWeight("");
      
      fetchCows();
      router.refresh();
    } catch (error) {
      toast.error("Failed to add cow", { description: "Please ensure the Collar ID is unique." });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Cattle Management</h1>
        
        <Dialog open={open} onOpenChange={setOpen}>
            <Button className="flex items-center gap-2" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> Add Cow
            </Button>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Register New Cow</DialogTitle>
              <DialogDescription>
                Attach a smart collar and enter the details of the cow here.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCow}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="collarId" className="text-right">Collar ID</Label>
                  <Input id="collarId" value={collarId} onChange={(e) => setCollarId(e.target.value)} placeholder="e.g. 99" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name (Opt)</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ganga" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="breed" className="text-right">Breed</Label>
                  <Input id="breed" value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="e.g. Holstein" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="age" className="text-right">Age (Yrs)</Label>
                  <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 4" className="col-span-3" required min="0" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="weight" className="text-right">Weight (kg)</Label>
                  <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 600" className="col-span-3" required min="0" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isAdding}>
                  {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Register Cow
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Herd Directory</CardTitle>
          <CardDescription>
            Manage your cattle and view their current health status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Collar ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Breed</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Pulse</TableHead>
                  <TableHead>Temp</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cows.map((cow) => (
                  <TableRow key={cow.id}>
                    <TableCell className="font-medium">#{cow.id}</TableCell>
                    <TableCell>{cow.name || "N/A"}</TableCell>
                    <TableCell>{cow.breed}</TableCell>
                    <TableCell>{cow.age}</TableCell>
                    <TableCell>{cow.weight}</TableCell>
                    <TableCell>{cow.pulse || "--"} BPM</TableCell>
                    <TableCell>{cow.temp || "--"}°C</TableCell>
                    <TableCell>
                      <Badge variant={cow.status === "Healthy" ? "default" : cow.status === "Critical" ? "destructive" : "secondary"}>
                        {cow.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {cows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                      No cattle found. Click "Add Cow" to register a new collar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
