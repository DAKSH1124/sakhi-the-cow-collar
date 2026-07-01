const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Clear existing
  await prisma.alert.deleteMany();
  await prisma.sensorData.deleteMany();
  await prisma.cow.deleteMany();
  await prisma.user.deleteMany();

  // Create User
  const user = await prisma.user.create({
    data: {
      email: "farmer@sakhi.com",
      name: "Ramesh Farmer",
      role: "FARMER",
    },
  });

  // Create Cows
  const cows = [
    { collarId: "12", name: "Ganga", breed: "Holstein", age: 4, weight: 600, status: "Healthy" },
    { collarId: "45", name: "Jamuna", breed: "Jersey", age: 3, weight: 450, status: "Critical" },
    { collarId: "88", name: "Saraswati", breed: "Holstein", age: 5, weight: 620, status: "Warning" },
    { collarId: "09", name: "Narmada", breed: "Guernsey", age: 2, weight: 400, status: "Healthy" },
    { collarId: "15", name: "Kaveri", breed: "Jersey", age: 4, weight: 480, status: "Healthy" },
  ];

  const dbCows = [];
  for (const cow of cows) {
    const dbCow = await prisma.cow.create({
      data: {
        ...cow,
        userId: user.id,
      },
    });
    dbCows.push(dbCow);
  }

  // Generate Sensor Data for the last 24 hours (every 4 hours)
  const times = [
    new Date(Date.now() - 24 * 3600 * 1000),
    new Date(Date.now() - 20 * 3600 * 1000),
    new Date(Date.now() - 16 * 3600 * 1000),
    new Date(Date.now() - 12 * 3600 * 1000),
    new Date(Date.now() - 8 * 3600 * 1000),
    new Date(Date.now() - 4 * 3600 * 1000),
    new Date(),
  ];

  const baseData = {
    "12": { pulse: 72, temp: 38.6, lat: 28.6145, lng: 77.2085, battery: 85 },
    "45": { pulse: 90, temp: 40.2, lat: 28.6130, lng: 77.2100, battery: 42 },
    "88": { pulse: 65, temp: 38.4, lat: 28.6150, lng: 77.2110, battery: 15 },
    "09": { pulse: 70, temp: 38.5, lat: 28.6160, lng: 77.2090, battery: 90 },
    "15": { pulse: 74, temp: 38.7, lat: 28.6120, lng: 77.2070, battery: 78 },
  };

  for (const cow of dbCows) {
    const base = baseData[cow.collarId as keyof typeof baseData];
    
    for (let i = 0; i < times.length; i++) {
      // Add some slight random variation to pulse and temp
      const pulseVar = Math.floor(Math.random() * 5) - 2;
      const tempVar = (Math.random() * 0.4 - 0.2).toFixed(1);
      
      await prisma.sensorData.create({
        data: {
          pulse: base.pulse + pulseVar,
          temperature: parseFloat((base.temp + parseFloat(tempVar)).toFixed(1)),
          lat: base.lat,
          lng: base.lng,
          battery: base.battery,
          timestamp: times[i],
          cowId: cow.id,
        },
      });
    }

    // Generate alerts if status is not healthy
    if (cow.status === "Critical") {
      await prisma.alert.create({
        data: {
          type: "Temperature",
          message: `High Temperature: Cow #${cow.collarId}`,
          severity: "Critical",
          timestamp: new Date(),
          cowId: cow.id,
        },
      });
    } else if (cow.status === "Warning") {
      await prisma.alert.create({
        data: {
          type: "Battery",
          message: `Low Battery: Cow #${cow.collarId}`,
          severity: "Warning",
          timestamp: new Date(),
          cowId: cow.id,
        },
      });
    }
  }

  // Create a specific geofence alert for cow #12
  const cow12 = dbCows.find(c => c.collarId === "12");
  if (cow12) {
    await prisma.alert.create({
      data: {
        type: "GeoFence",
        message: `Geo-fence breach: Cow #12`,
        severity: "Info",
        timestamp: new Date(),
        cowId: cow12.id,
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
