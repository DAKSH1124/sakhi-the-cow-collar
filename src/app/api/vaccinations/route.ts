import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { name, dateAdministered, nextDueDate, status, notes, cowId } = body;

    // Verify the cow belongs to the user
    const cow = await prisma.cow.findUnique({
      where: { id: cowId }
    });

    if (!cow || cow.userId !== userId) {
      return NextResponse.json({ error: "Cow not found or unauthorized" }, { status: 403 });
    }

    const newVaccination = await prisma.vaccination.create({
      data: {
        name,
        dateAdministered: dateAdministered ? new Date(dateAdministered) : null,
        nextDueDate: new Date(nextDueDate),
        status: status || "Pending",
        notes,
        cowId
      }
    });

    return NextResponse.json(newVaccination, { status: 201 });
  } catch (error) {
    console.error("Error adding vaccination:", error);
    return NextResponse.json({ error: "Failed to add vaccination" }, { status: 500 });
  }
}
