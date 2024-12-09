/*
  Warnings:

  - You are about to drop the column `executerFullName` on the `task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "task" DROP COLUMN "executerFullName",
ADD COLUMN     "executer_fullname" TEXT;
