/*
  Warnings:

  - You are about to drop the column `wordIds` on the `Quiz` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "wordIds";

-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "folderId" INTEGER;

-- CreateTable
CREATE TABLE "_QuizWords" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_QuizWords_AB_unique" ON "_QuizWords"("A", "B");

-- CreateIndex
CREATE INDEX "_QuizWords_B_index" ON "_QuizWords"("B");

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuizWords" ADD CONSTRAINT "_QuizWords_A_fkey" FOREIGN KEY ("A") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuizWords" ADD CONSTRAINT "_QuizWords_B_fkey" FOREIGN KEY ("B") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
