import { NextResponse } from "next/server";
import { processSensorData } from "@/features/sensors/backend/sensorService";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const result = await processSensorData(data);
    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (error: any) {
    console.error("Error receiving sensor data:", error);
    if (error.message === "Cow with this collarId not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to process sensor data" }, { status: 500 });
  }
}
