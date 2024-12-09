/*
  Warnings:

  - You are about to drop the column `note` on the `task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "task" DROP COLUMN "note";

-- CreateTable
CREATE TABLE "task_notes" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note_by" TEXT NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "task_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "task_notes_taskId_idx" ON "task_notes"("taskId");

-- AddForeignKey
ALTER TABLE "task_notes" ADD CONSTRAINT "task_notes_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
