/*
  Warnings:

  - The primary key for the `task_history` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "task_history" DROP CONSTRAINT "task_history_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "task_history_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "task_history_id_seq";
