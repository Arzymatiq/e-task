/*
  Warnings:

  - The values [SEND_TO_CONFRIM] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('CREATED', 'IN_PROCCESS', 'SEND_TO_CONFIRM', 'DONE', 'ROLLED_BACK');
ALTER TABLE "task" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "task" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "task" ALTER COLUMN "status" SET DEFAULT 'CREATED';
COMMIT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false;
