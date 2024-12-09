/*
  Warnings:

  - The values [FINISHED,COMPLETED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `responsibleId` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `taskNumber` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `taskTitle` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `user` table. All the data in the column will be lost.
  - Added the required column `incoming_date` to the `task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responsible_id` to the `task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `task_number` to the `task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `task_text` to the `task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('CREATED', 'IN_PROCCESS', 'SEND_TO_CONFRIM', 'DONE', 'ROLLED_BACK');
ALTER TABLE "task" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "task" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "task" ALTER COLUMN "status" SET DEFAULT 'CREATED';
COMMIT;

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_responsibleId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_roleId_fkey";

-- AlterTable
ALTER TABLE "task" DROP COLUMN "responsibleId",
DROP COLUMN "taskNumber",
DROP COLUMN "taskTitle",
ADD COLUMN     "incoming_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "responsible_id" TEXT NOT NULL,
ADD COLUMN     "task_number" INTEGER NOT NULL,
ADD COLUMN     "task_text" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "roleId",
ADD COLUMN     "role_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "responsible"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
