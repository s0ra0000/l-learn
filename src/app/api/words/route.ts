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

    const { word, definition, translation } = await request.json();

    const newWord = await prisma.word.create({
      data: {
        word,
        definition,
        translation,
        createdBy: user.id,
      },
    });

    return NextResponse.json(newWord);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}

// Get all words for the authenticated user
export async function GET(request: Request) {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const words = await prisma.word.findMany({
      where: {
        createdBy: user.id,
      },
    });

    return NextResponse.json(words);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}

// Update a word by ID if it belongs to the authenticated user
export async function PATCH(request: Request) {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, word, definition, translation, status } = await request.json();

    // Check if the word belongs to the authenticated user
    const existingWord = await prisma.word.findUnique({
      where: { id },
    });

    if (existingWord?.createdBy !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedWord = await prisma.word.update({
      where: { id },
      data: {
        word,
        definition,
        translation,
        status,
      },
    });

    return NextResponse.json(updatedWord);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}

// Delete a word by ID if it belongs to the authenticated user
export async function DELETE(request: Request) {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    // Check if the word belongs to the authenticated user
    const existingWord = await prisma.word.findUnique({
      where: { id },
    });

    if (existingWord?.createdBy !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.word.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Word deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
