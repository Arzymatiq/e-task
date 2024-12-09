/*
  Warnings:

  - Added the required column `changedByFullName` to the `task_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task_history" ADD COLUMN     "changedByFullName" TEXT NOT NULL;
