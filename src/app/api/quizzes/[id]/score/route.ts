// File: /pages/api/quizzes/[id]/score/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Import the singleton Prisma instance

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { score } = await request.json();
    const quizId = Number(params.id);

    if (score === undefined) {
      return NextResponse.json(
        { error: "Invalid request: missing score" },
        { status: 400 }
      );
    }

    // Find the current quiz to get the existing score
    const currentQuiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!currentQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Only update if the new score is higher than the current score
    if (score > currentQuiz.score) {
      const updatedQuiz = await prisma.quiz.update({
        where: { id: quizId },
        data: { score },
      });

      return NextResponse.json(updatedQuiz, { status: 200 });
    } else {
      // Return a response indicating no update was necessary
      return NextResponse.json(
        {
          message:
            "Score not updated as it was not higher than the current score",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error updating quiz score:", error);
    return NextResponse.json(
      { error: "Unable to update quiz score" },
      { status: 500 }
    );
  }
}
