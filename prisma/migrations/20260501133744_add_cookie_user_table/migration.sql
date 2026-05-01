/*
  Warnings:

  - A unique constraint covering the columns `[quizCode]` on the table `Quiz` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `quizCode` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "quizCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cookie" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_quizCode_key" ON "Quiz"("quizCode");
