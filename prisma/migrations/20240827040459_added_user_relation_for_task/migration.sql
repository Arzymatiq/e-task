/*
  Warnings:

  - Added the required column `userId` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
