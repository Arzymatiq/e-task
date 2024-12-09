-- CreateTable
CREATE TABLE "task_history" (
    "id" SERIAL NOT NULL,
    "taskId" TEXT NOT NULL,
    "oldStatus" "Status" NOT NULL,
    "newStatus" "Status" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedBy" TEXT NOT NULL,

    CONSTRAINT "task_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "task_history_taskId_idx" ON "task_history"("taskId");

-- AddForeignKey
ALTER TABLE "task_history" ADD CONSTRAINT "task_history_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
