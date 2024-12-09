import { Injectable } from '@nestjs/common';
import { CreateTaskNoteDto } from './dto/create-task-note.dto';
import { UpdateTaskNoteDto } from './dto/update-task-note.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TaskNoteService {
    constructor(private prisma: PrismaService) {}
    create(dto: CreateTaskNoteDto) {
        if (dto.noteBy)
            return this.prisma.taskNotes.create({
                data: dto,
            });
    }

    findMany(taskId) {
        return this.prisma.taskNotes.findMany({ where: { taskId } });
    }

    findOne(id: number) {
        return `This action returns a #${id} taskNote`;
    }

    update(id: number, updateTaskNoteDto: UpdateTaskNoteDto) {
        return `This action updates a #${id} taskNote`;
    }

    remove(id: number) {
        return `This action removes a #${id} taskNote`;
    }
}
