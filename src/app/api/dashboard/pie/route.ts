import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Status } from "@prisma/client";
import prisma from "@/lib/prisma"; // Import the singleton Prisma instance

export async function GET() {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Count words by status for the authenticated user
    const notYetCount = await prisma.word.count({
      where: { createdBy: user.id, status: Status.NOT_YET },
    });
    const inProgressCount = await prisma.word.count({
      where: { createdBy: user.id, status: Status.IN_PROGRESS },
    });
    const completedCount = await prisma.word.count({
      where: { createdBy: user.id, status: Status.COMPLETED },
    });

    return NextResponse.json(
      {
        notYet: notYetCount,
        inProgress: inProgressCount,
        completed: completedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching pie chart data:", error);
    return NextResponse.json(
      { error: "Unable to fetch pie chart data" },
      { status: 500 }
    );
  }
}
