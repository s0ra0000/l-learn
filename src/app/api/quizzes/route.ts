import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma"; // Import the singleton Prisma instance

export async function POST(request: Request) {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { quizName, wordIds } = await request.json();

    if (!quizName || !wordIds || !Array.isArray(wordIds)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const newQuiz = await prisma.quiz.create({
      data: {
        quizName,
        score: 0,
        createdBy: user.id,
        words: {
          connect: wordIds.map((id: number) => ({ id })),
        },
      },
    });

    return NextResponse.json(newQuiz, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json(
      { error: "Unable to create quiz" },
      { status: 500 }
    );
  }
}

// Get all quizzes for the authenticated user
export async function GET(request: Request) {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quizzes = await prisma.quiz.findMany({
      where: {
        createdBy: user.id,
      },
      include: {
        words: true,
      },
    });

    const quizzesWithWordCount = quizzes.map((quiz) => ({
      ...quiz,
      quantity: quiz.words.length,
    }));

    return NextResponse.json(quizzesWithWordCount, { status: 200 });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Unable to fetch quizzes" },
      { status: 500 }
    );
  }
}
