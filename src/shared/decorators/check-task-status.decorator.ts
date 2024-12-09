import { TaskStatusGuard } from '../guards/check-task-status.guard';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

export const CHECK_TASK_STATUS_KEY = 'checkTaskStatus';
export const CheckTaskStatus = (...role: string[]) => {
    return applyDecorators(SetMetadata(CHECK_TASK_STATUS_KEY, role), UseGuards(TaskStatusGuard));
};
