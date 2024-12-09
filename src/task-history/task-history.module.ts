import { PrismaService } from 'src/prisma.service';
import { Module } from '@nestjs/common';
import { TaskHistoryService } from './task-history.service';
import { TaskHistoryController } from './task-history.controller';

@Module({
    controllers: [TaskHistoryController],
    providers: [TaskHistoryService, PrismaService],
    exports: [TaskHistoryService],
})
export class TaskHistoryModule {}
