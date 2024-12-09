import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TasksSchedulerService {
    constructor(private readonly prisma: PrismaService) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleCron() {
        const currentDate = new Date();

        await this.prisma.task.updateMany({
            where: {
                deadline: {
                    lt: currentDate,
                },
            },
            data: {
                isExpired: true,
            },
        });

        await this.prisma.task.updateMany({
            where: {
                deadline: {
                    gte: currentDate,
                },
            },
            data: {
                isExpired: false,
            },
        });

        console.log('corn update1');
    }
}
