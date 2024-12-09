-- AlterTable
ALTER TABLE "task" ADD COLUMN     "is_urgently" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "is_password_date_expired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_password_changed_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
