-- CreateEnum
CREATE TYPE "Status" AS ENUM ('CREATED', 'FINISHED', 'COMPLETED');

-- CreateTable
CREATE TABLE "task" (
    "id" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(3) NOT NULL,
    "taskNumber" INTEGER NOT NULL,
    "taskTitle" TEXT NOT NULL,
    "responsibleId" TEXT NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'CREATED',
    "note" TEXT NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsible" (
    "id" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "responsible_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "roleId" INTEGER NOT NULL,
    "login" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_login_key" ON "user"("login");

-- CreateIndex
CREATE UNIQUE INDEX "role_id_key" ON "role"("id");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "responsible"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
