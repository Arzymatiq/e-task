/*
  Warnings:

  - You are about to drop the column `executerFullName` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "task" ADD COLUMN     "executerFullName" TEXT;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "executerFullName";
