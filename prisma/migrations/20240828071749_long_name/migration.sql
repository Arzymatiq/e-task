/*
  Warnings:

  - A unique constraint covering the columns `[longName]` on the table `responsible` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "responsible" ADD COLUMN     "longName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "responsible_longName_key" ON "responsible"("longName");
