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

    const { folderName } = await request.json();

    if (!folderName) {
      return NextResponse.json(
        { error: "Folder name is required" },
        { status: 400 }
      );
    }

    const newFolder = await prisma.folder.create({
      data: {
        folderName,
        createdBy: user.id,
      },
    });

    return NextResponse.json(newFolder, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}

// Get all folders for the authenticated user
export async function GET(request: Request) {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const folders = await prisma.folder.findMany({
      where: {
        createdBy: user.id,
      },
      include: {
        words: true, // Include related words in the response
      },
    });

    // Include the word count in the response
    const foldersWithWordCount = folders.map((folder) => ({
      ...folder,
      wordCount: folder.words.length,
    }));

    return NextResponse.json(foldersWithWordCount);
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json(
      { error: "Error fetching folders" },
      { status: 500 }
    );
  }
}
