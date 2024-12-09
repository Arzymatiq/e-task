import { PrismaService } from 'src/prisma.service';
import { Module } from '@nestjs/common';
import { TaskNoteService } from './task-note.service';
import { TaskNoteController } from './task-note.controller';

@Module({
  controllers: [TaskNoteController],
  providers: [TaskNoteService, PrismaService],
  exports: [TaskNoteService],
})
export class TaskNoteModule {}
