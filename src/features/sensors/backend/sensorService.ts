import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function processSensorData(data: any) {
  // Expected payload from ESP32: { collarId, pulse, temperature, lat, lng, battery }
  const cow = await prisma.cow.findUnique({
    where: { collarId: data.collarId }
  });

  if (!cow) {
    throw new Error("Cow with this collarId not found");
  }

  // Insert the sensor data
  const sensorData = await prisma.sensorData.create({
    data: {
      pulse: parseFloat(data.pulse),
      temperature: parseFloat(data.temperature),
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lng),
      battery: parseFloat(data.battery),
      cowId: cow.id,
    }
  });

  // Simple backend logic to evaluate health and create alerts if needed
  let newStatus = "Healthy";
  const alerts = [];

  if (data.temperature > 39.5 || data.pulse > 85) {
    newStatus = "Critical";
    alerts.push({
      type: "Health",
      message: `Critical vitals detected for Cow #${cow.collarId} (Pulse: ${data.pulse}, Temp: ${data.temperature})`,
      severity: "Critical",
    });
  } else if (data.temperature < 37.5 || data.pulse < 50) {
    newStatus = "Warning";
    alerts.push({
      type: "Health",
      message: `Low vitals detected for Cow #${cow.collarId} (Pulse: ${data.pulse}, Temp: ${data.temperature})`,
      severity: "Warning",
    });
  }

  if (data.battery < 20) {
    if (newStatus === "Healthy") newStatus = "Warning"; // Don't downgrade from critical
    alerts.push({
      type: "Battery",
      message: `Low battery (${data.battery}%) on Cow #${cow.collarId}`,
      severity: "Warning",
    });
  }

  // Update cow status
  if (newStatus !== cow.status) {
    await prisma.cow.update({
      where: { id: cow.id },
      data: { status: newStatus }
    });
  }

  // Create alerts
  for (const alert of alerts) {
    await prisma.alert.create({
      data: {
        ...alert,
        cowId: cow.id,
      }
    });
  }

  return { sensorData, newStatus };
}
