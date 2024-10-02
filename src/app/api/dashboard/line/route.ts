import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma"; // Import the singleton Prisma instance

export async function GET() {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create an array of dates for the past 7 days
    const currentDate = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(currentDate.getDate() - i);
      return date;
    }).reverse(); // Reverse to have oldest first

    // Count words created on each date for the authenticated user
    const wordCounts = await Promise.all(
      dates.map(async (date) => {
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);

        const count = await prisma.word.count({
          where: {
            createdBy: user.id,
            createdAt: {
              gte: date,
              lt: nextDate,
            },
          },
        });
        return count;
      })
    );

    return NextResponse.json({ wordCounts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching line chart data:", error);
    return NextResponse.json(
      { error: "Unable to fetch line chart data" },
      { status: 500 }
    );
  }
}
