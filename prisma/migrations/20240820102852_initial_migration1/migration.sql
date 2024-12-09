-- AlterTable
ALTER TABLE "user" ADD COLUMN     "responsibleId" TEXT;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "responsible"("id") ON DELETE SET NULL ON UPDATE CASCADE;
