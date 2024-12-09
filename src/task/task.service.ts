import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma.service';
import { paginator, PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';
import { Status } from '@prisma/client';
import { TaskHistoryService } from 'src/task-history/task-history.service';
import { StatusEnum } from 'src/enums/status.enum';
import { TasksSchedulerService } from 'src/tasks-scheduler/tasks-scheduler.service';

const translates = {
    taskNumber: 'Номер поручения',
    incomingDate: 'Дата поступления',
    taskText: 'Задачи',
    responsibleId: 'Ответственные',
    deadline: 'Срок исполнения',
    status: 'Статус',
};

interface IFindAll {
    page?: number;
    perPage?: number;
    taskNumber?: string;
    taskText?: string;
    responsibleId?: string;
    taskStatus?: Status;
    isExpired?: boolean;
}

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class TaskService {
    constructor(
        private prisma: PrismaService,
        private taskHistoryService: TaskHistoryService,
        private tasksSchedulerService: TasksSchedulerService,
    ) {}

    async create(dto: CreateTaskDto, userId: string, responsibleId: string) {
        const { responsibleIds, ...data } = dto;
        return await this.prisma.task.create({
            data: { ...data, responsibleId, userId },
        });
    }

    async findManyByStatus() {
        const result = [];
        const statusValues = Object.values(Status);
        for (const staus of statusValues) {
            const tasks = await this.prisma.task.findMany({ where: { status: staus } });
            result.push({ name: staus, count: tasks.length });
        }

        console.log(statusValues);
        console.log(result);

        return result;
    }
    async findAll({ page, perPage, taskNumber, taskText, responsibleId, taskStatus, isExpired }: IFindAll) {
        return paginate(
            this.prisma.task,
            {
                where: {
                    AND: [
                        responsibleId ? { responsibleId } : {},
                        taskNumber ? { taskNumber: { contains: taskNumber } } : {},
                        taskText ? { taskText: { contains: taskText } } : {},
                        taskStatus ? { status: taskStatus } : { status: { not: Status.ARCHIVE } },
                        isExpired ? { isExpired: true } : {},
                    ],
                },
                orderBy: [
                    {
                        isUrgently: 'desc',
                    },
                    {
                        createdDate: 'desc',
                    },
                ],
                include: {
                    responsible: {
                        select: {
                            name: true,
                        },
                    },
                    user: {
                        select: {
                            fullName: true,
                            login: true,
                        },
                    },
                    TaskNotes: true,
                },
            },
            {
                page,
                perPage,
            },
        );
    }

    findOne(id: string) {
        return this.prisma.task.findUnique({
            where: { id },
            include: {
                responsible: {
                    select: {
                        name: true,
                    },
                },
                user: {
                    select: {
                        fullName: true,
                        login: true,
                    },
                },
                TaskNotes: true,
            },
        });
    }

    async requestExtenstion(id: string, newDeadline: Date) {
        return this.prisma.task.update({
            where: { id },
            data: { newDeadline, extensionRequestedStatus: Status.PENDING },
        });
    }

    async approveRequestExtenstion(id: string, changedBy: string, changedByFullName: string) {
        const taskNewDeadline = (await this.findOne(id)).newDeadline;
        if (!taskNewDeadline) throw new ForbiddenException('new deadline is not provided');

        const task = await this.update(
            id,
            { deadline: taskNewDeadline, newDeadline: null },
            changedBy,
            changedByFullName,
        );

        await this.tasksSchedulerService.handleCron();
        return task;
    }

    async rejectRequestExtenstion(id: string, changedBy: string, changedByFullName: string) {
        return await this.update(id, { extensionRequestedStatus: Status.REJECTED }, changedBy, changedByFullName);
    }

    async update(id: string, dto: UpdateTaskDto, changedBy: string, changedByFullName: string) {
        const keys = Object.keys(dto);
        const task = await this.findOne(id);

        this.taskHistoryService.create({
            taskId: id,
            changedAt: new Date(),
            changedBy: changedBy,
            oldStatus: task.status,
            newStatus: task.status,
            changedByFullName,
            details: keys
                .map(el => {
                    return translates[el] ? `Поле ${translates[el]} изменен с "${task[el]}" на "${dto[el]}"` : null;
                })
                .join('*'),
        });

        return this.prisma.task.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        this.prisma.task.delete({ where: { id } });
    }

    async updateTaskStatus(id: string, status: Status, changedBy: string, changedByFullName: string) {
        try {
            const prevStatus = (await this.prisma.task.findUnique({ where: { id } }))?.status;
            const executorFullName = status === Status.IN_PROCCESS ? changedByFullName : null;
            const task = await this.prisma.task.update({
                where: { id },
                data: { status, executorFullName },
                include: {
                    TaskNotes: true,
                },
            });

            if (!task) {
                throw new NotFoundException(`Task with ID ${id} not found`);
            }

            this.taskHistoryService.create({
                taskId: id,
                changedAt: new Date(),
                changedBy: changedBy || '',
                oldStatus: prevStatus,
                newStatus: status,
                changedByFullName,
                details: `Поле ${translates.status} изменен с "${prevStatus}" на "${status}"`,
            });

            return task;
        } catch (error) {
            console.error(`Error updating task status to ${status}:`, error);
        }
    }
}
