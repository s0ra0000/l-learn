import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma"; // Import the singleton Prisma instance

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const updatedFolder = await prisma.folder.update({
      where: { id: Number(params.id) },
      data: { folderName },
    });

    return NextResponse.json(updatedFolder);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.folder.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ message: "Folder deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
