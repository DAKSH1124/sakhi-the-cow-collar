import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const cows = await prisma.cow.findMany({
      where: { userId },
      include: {
        sensorData: {
          orderBy: { timestamp: "desc" },
          take: 1, // Get the latest sensor reading for each cow
        }
      }
    });

    // Format data for the frontend
    const formattedCows = cows.map(cow => {
      const latestData = cow.sensorData[0] || { pulse: 0, temperature: 0, lat: null, lng: null };
      return {
        id: cow.collarId,
        name: cow.name,
        breed: cow.breed,
        age: `${cow.age} yrs`,
        weight: `${cow.weight} kg`,
        pulse: latestData.pulse,
        temp: latestData.temperature,
        lat: latestData.lat,
        lng: latestData.lng,
        status: cow.status,
      };
    });

    return NextResponse.json(formattedCows);
  } catch (error) {
    console.error("Error fetching cows:", error);
    return NextResponse.json({ error: "Failed to fetch cows" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const data = await req.json();
    
    const newCow = await prisma.cow.create({
      data: {
        collarId: data.collarId,
        name: data.name || null,
        breed: data.breed,
        age: parseInt(data.age),
        weight: parseFloat(data.weight),
        userId: userId,
      }
    });

    return NextResponse.json(newCow, { status: 201 });
  } catch (error) {
    console.error("Error adding cow:", error);
    return NextResponse.json({ error: "Failed to add cow" }, { status: 500 });
  }
}
