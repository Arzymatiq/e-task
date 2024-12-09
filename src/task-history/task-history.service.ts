/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable } from '@nestjs/common';
import { CreateTaskHistoryDto } from './dto/create-task-history.dto';
import { UpdateTaskHistoryDto } from './dto/update-task-history.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TaskHistoryService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateTaskHistoryDto) {
        return await this.prisma.taskHistory.create({
            data: dto,
        });
    }

    findAll() {
        return `This action returns all taskHistory`;
    }
    findMany(taskId: string) {
        return this.prisma.taskHistory.findMany({ where: { taskId } });
    }
    findOne(id: number) {
        return `This action returns a #${id} taskHistory`;
    }

    update(id: number, updateTaskHistoryDto: UpdateTaskHistoryDto) {
        return `This action updates a #${id} taskHistory`;
    }

    remove(id: number) {
        return `This action removes a #${id} taskHistory`;
    }
}
