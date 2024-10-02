import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Import the singleton Prisma instance

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { wordId }: { wordId: number } = await request.json();
    const folderId = Number(params.id);

    if (!wordId || !folderId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Update the word with the folderId to associate it with the folder
    const updatedWord = await prisma.word.update({
      where: { id: wordId },
      data: { folderId },
    });

    return NextResponse.json(updatedWord, { status: 200 });
  } catch (error) {
    console.error("Error adding word to folder:", error);
    return NextResponse.json(
      { error: "Unable to add word to folder" },
      { status: 500 }
    );
  }
}
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const folderId = Number(params.id);

    if (!folderId) {
      return NextResponse.json({ error: "Invalid folder ID" }, { status: 400 });
    }

    // Find all words associated with the given folder ID
    const words = await prisma.word.findMany({
      where: {
        folderId: folderId,
      },
    });

    return NextResponse.json(words, { status: 200 });
  } catch (error) {
    console.error("Error fetching words for folder:", error);
    return NextResponse.json(
      { error: "Unable to fetch words for folder" },
      { status: 500 }
    );
  }
}
