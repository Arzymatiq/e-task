/*
  Warnings:

  - You are about to drop the column `note_by` on the `task_notes` table. All the data in the column will be lost.
  - Added the required column `noteBy` to the `task_notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task_notes" DROP COLUMN "note_by",
ADD COLUMN     "noteBy" TEXT NOT NULL;
