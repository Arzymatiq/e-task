import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Inject,
    NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TaskService } from 'src/task/task.service';
import { CHECK_TASK_STATUS_KEY } from '../decorators/check-task-status.decorator';
import { ERROR_MESSAGES } from 'src/constants/errors-message';

@Injectable()
export class TaskStatusGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject(TaskService) private tasksService: TaskService, // Инжектируем сервис
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredStatuses = this.reflector.get<string[]>(CHECK_TASK_STATUS_KEY, context.getHandler());
        console.log('requiredStatuses', requiredStatuses);
        if (!requiredStatuses.length) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const taskId = request.params.id;

        const task = await this.tasksService.findOne(taskId);
        if (!task) {
            throw new NotFoundException(ERROR_MESSAGES.ru.NOT_FOUND);
        }

        if (!requiredStatuses.includes(task.status)) {
            throw new ForbiddenException(ERROR_MESSAGES.ru.NOT_CORRECT_STATUS);
        }

        return true;
    }
}
