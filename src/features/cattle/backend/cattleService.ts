import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCowsForUser(userId: string) {
  const cows = await prisma.cow.findMany({
    where: { userId },
    include: {
      sensorData: {
        orderBy: { timestamp: "desc" },
        take: 1, // Get the latest sensor reading for each cow
      }
    }
  });

  return cows.map(cow => {
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
}

export async function createCow(userId: string, data: any) {
  return await prisma.cow.create({
    data: {
      collarId: data.collarId,
      name: data.name || null,
      breed: data.breed,
      age: parseInt(data.age),
      weight: parseFloat(data.weight),
      userId: userId,
    }
  });
}
