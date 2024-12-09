/*
  Warnings:

  - Added the required column `fullName` to the `task_notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task_notes" ADD COLUMN     "fullName" TEXT NOT NULL;
