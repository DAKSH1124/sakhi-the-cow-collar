import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCowsForUser, createCow } from "@/features/cattle/backend/cattleService";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const formattedCows = await getCowsForUser(userId);

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
    
    const newCow = await createCow(userId, data);

    return NextResponse.json(newCow, { status: 201 });
  } catch (error) {
    console.error("Error adding cow:", error);
    return NextResponse.json({ error: "Failed to add cow" }, { status: 500 });
  }
}
