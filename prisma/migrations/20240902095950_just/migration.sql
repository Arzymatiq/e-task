/*
  Warnings:

  - You are about to drop the column `executer_fullname` on the `task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "task" DROP COLUMN "executer_fullname",
ADD COLUMN     "executer_full_name" TEXT;
