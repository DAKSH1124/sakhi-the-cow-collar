import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getDashboardStats(userId: string) {
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

  // Fetch the average temperature from the latest sensor data for this user's cows
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

  return {
    totalCattle,
    healthyCows,
    criticalCows,
    avgTemp: avgTemp.toFixed(1),
    recentAlerts: alerts,
  };
}
