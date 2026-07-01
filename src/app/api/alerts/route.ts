import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// Mock news data
const CATTLE_NEWS = [
  {
    id: 1,
    title: "Understanding Foot-and-Mouth Disease (FMD) Outbreaks",
    summary: "Early detection and immediate vaccination are critical to containing FMD. Here are the top 5 signs to watch out for in your herd.",
    date: new Date().toISOString(),
    source: "Dairy Farming Today",
    category: "Health"
  },
  {
    id: 2,
    title: "Summer Heat Stress in Cattle: Prevention Strategies",
    summary: "As temperatures rise, milk yield drops. Implement these shading and hydration strategies to keep your cows comfortable.",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    source: "AgriTech News",
    category: "Management"
  },
  {
    id: 3,
    title: "The Importance of Brucellosis Vaccination for Calves",
    summary: "Ensuring your female calves receive the Brucellosis vaccine between 4 to 8 months is vital for herd immunity and human safety.",
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    source: "Veterinary Weekly",
    category: "Vaccines"
  }
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Fetch System Alerts for this user's cows
    const systemAlerts = await prisma.alert.findMany({
      where: { cow: { userId } },
      orderBy: { timestamp: "desc" },
      include: { cow: true },
    });

    // Fetch Vaccinations for this user's cows
    const vaccinations = await prisma.vaccination.findMany({
      where: { cow: { userId } },
      orderBy: { nextDueDate: "asc" },
      include: { cow: true },
    });

    return NextResponse.json({
      systemAlerts,
      vaccinations,
      news: CATTLE_NEWS
    });
  } catch (error) {
    console.error("Error fetching alerts data:", error);
    return NextResponse.json({ error: "Failed to fetch alerts data" }, { status: 500 });
  }
}
