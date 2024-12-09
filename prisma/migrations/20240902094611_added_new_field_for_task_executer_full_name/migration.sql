-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'FULFILLED';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "executerFullName" TEXT;
