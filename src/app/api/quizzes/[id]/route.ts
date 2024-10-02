import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Import the singleton Prisma instance

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = Number(params.id);

    // Fetch quiz and related words
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        words: true, // Assuming your quiz table has a relation to words
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const words = quiz.words;

    // Generate questions
    const questions = words.map((word) => {
      const otherWords = words.filter((w) => w.id !== word.id);
      let options = [];

      // Select distractors based on the number of available words
      if (otherWords.length < 3) {
        // If there are fewer than 3 other words, use all of them
        options = otherWords.map((w) => ({
          text: w.definition,
          isCorrect: false,
        }));
      } else {
        // Otherwise, randomly select 3 other words as distractors
        const shuffled = otherWords.sort(() => 0.5 - Math.random());
        options = shuffled
          .slice(0, 3)
          .map((w) => ({ text: w.definition, isCorrect: false }));
      }

      // Add the correct answer
      options.push({ text: word.definition, isCorrect: true });

      // Shuffle the options
      options = options.sort(() => 0.5 - Math.random());

      return {
        word: word.word,
        options,
      };
    });

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    return NextResponse.json(
      { error: "Unable to fetch quiz data" },
      { status: 500 }
    );
  }
}

// PATCH function for updating the quiz name or score
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { quizName, score } = await request.json();
    const quizId = Number(params.id);

    if (!quizName && score === undefined) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    let updatedQuiz;
    if (quizName) {
      updatedQuiz = await prisma.quiz.update({
        where: { id: quizId },
        data: {
          quizName,
        },
      });
    }
    if (score !== undefined) {
      updatedQuiz = await prisma.quiz.update({
        where: { id: quizId },
        data: {
          score,
        },
      });
    }

    return NextResponse.json(updatedQuiz, { status: 200 });
  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json(
      { error: "Unable to update quiz" },
      { status: 500 }
    );
  }
}

// DELETE function for deleting a quiz
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = Number(params.id);

    await prisma.quiz.delete({
      where: { id: quizId },
    });

    return NextResponse.json(
      { message: "Quiz deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json(
      { error: "Unable to delete quiz" },
      { status: 500 }
    );
  }
}
