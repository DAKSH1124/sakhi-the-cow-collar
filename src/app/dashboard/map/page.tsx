"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the map component with SSR disabled
const CowMap = dynamic(() => import("@/features/cattle/frontend/CowMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-xl" />,
});

export default function MapPage() {
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Live GPS Tracking</h1>
      </div>
      
      <Card className="flex-1 flex flex-col overflow-hidden shadow-md border-border/40">
        <CardHeader className="pb-4 shrink-0">
          <CardTitle>Herd Location Map</CardTitle>
          <CardDescription>
            Real-time GPS tracking of all cattle wearing the Sakhi smart collar.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden relative">
          <div className="absolute inset-4 mt-0">
            <CowMap />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
