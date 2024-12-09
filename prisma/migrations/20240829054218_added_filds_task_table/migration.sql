-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Status" ADD VALUE 'PENDING';
ALTER TYPE "Status" ADD VALUE 'REQUEST_EXTENSTION';
ALTER TYPE "Status" ADD VALUE 'REJECT_REQUEST_EXTENSTION';
ALTER TYPE "Status" ADD VALUE 'APPROVE_REQUEST_EXTENSTION';

-- AlterTable
ALTER TABLE "task" ADD COLUMN     "extenstion_request" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "extenstion_request_status" "Status",
ADD COLUMN     "new_deadline" TIMESTAMP(3);
