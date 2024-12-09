import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ResponsibleModule } from './responsible/responsible.module';
import { TaskModule } from './task/task.module';
import { TaskHistoryModule } from './task-history/task-history.module';
import { TaskNoteModule } from './task-note/task-note.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksSchedulerService } from './tasks-scheduler/tasks-scheduler.service';
import { PrismaModule } from './prisma.module';
import { CorsPrivateNetworkMiddleware } from './middleware';

@Module({
    imports: [
        ConfigModule.forRoot(),
        AuthModule,
        UserModule,
        ResponsibleModule,
        TaskModule,
        TaskHistoryModule,
        PrismaModule,
        TaskNoteModule,
        ScheduleModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [AppService, TasksSchedulerService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CorsPrivateNetworkMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
