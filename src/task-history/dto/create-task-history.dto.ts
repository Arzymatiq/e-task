import { Status } from '@prisma/client';

export class CreateTaskHistoryDto {
    taskId: string;
    oldStatus: Status;
    newStatus: Status;
    changedAt: Date;
    changedBy: string;
    changedByFullName: string;
    details?: string;
}
