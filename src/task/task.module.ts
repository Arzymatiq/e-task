import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaService } from 'src/prisma.service';
import { TaskHistoryService } from 'src/task-history/task-history.service';
import { TaskNoteService } from 'src/task-note/task-note.service';
import { TasksSchedulerService } from 'src/tasks-scheduler/tasks-scheduler.service';
import { UserService } from 'src/user/user.service';

@Module({
    controllers: [TaskController],
    providers: [TaskService, PrismaService, TaskHistoryService, TaskNoteService, TasksSchedulerService, UserService],
})
export class TaskModule {}
