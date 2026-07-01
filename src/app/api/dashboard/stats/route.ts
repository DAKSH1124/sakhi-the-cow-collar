import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = (session.user as any).id;

    const cows = await prisma.cow.findMany({
      where: { userId }
    });
    
    const totalCattle = cows.length;
    const healthyCows = cows.filter(c => c.status === "Healthy").length;
    const criticalCows = cows.filter(c => c.status === "Critical").length;

    // Get alerts for this user's cows
    const alerts = await prisma.alert.findMany({
      where: {
        cow: { userId }
      },
      orderBy: { timestamp: "desc" },
      take: 5,
      include: { cow: true },
    });

    // We can also fetch the average temperature from the latest sensor data for this user's cows
    const latestSensorData = await prisma.sensorData.findMany({
      where: {
        cow: { userId }
      },
      distinct: ['cowId'],
      orderBy: { timestamp: "desc" },
    });
    
    const avgTemp = latestSensorData.length > 0 
      ? latestSensorData.reduce((acc, curr) => acc + curr.temperature, 0) / latestSensorData.length
      : 0;

    return NextResponse.json({
      totalCattle,
      healthyCows,
      criticalCows,
      avgTemp: avgTemp.toFixed(1),
      recentAlerts: alerts,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
