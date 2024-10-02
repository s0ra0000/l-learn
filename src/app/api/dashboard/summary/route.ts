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

    // Current date and date for one week ago
    const currentDate = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(currentDate.getDate() - 7);

    // Count all words for the authenticated user
    const totalWords = await prisma.word.count({
      where: {
        createdBy: user.id,
      },
    });

    // Count words created in the last week for the authenticated user
    const wordsLastWeek = await prisma.word.count({
      where: {
        createdBy: user.id,
        createdAt: {
          gte: oneWeekAgo,
        },
      },
    });

    // Count all quizzes for the authenticated user
    const totalQuizzes = await prisma.quiz.count({
      where: {
        createdBy: user.id,
      },
    });

    // Count quizzes created in the last week for the authenticated user
    const quizzesLastWeek = await prisma.quiz.count({
      where: {
        createdBy: user.id,
        createdAt: {
          gte: oneWeekAgo,
        },
      },
    });

    // Return all counts
    return NextResponse.json(
      {
        totalWords,
        wordsLastWeek,
        totalQuizzes,
        quizzesLastWeek,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    return NextResponse.json(
      { error: "Unable to fetch dashboard summary" },
      { status: 500 }
    );
  }
}
