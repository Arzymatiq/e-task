import { Test, TestingModule } from '@nestjs/testing';
import { TasksSchedulerService } from './tasks-scheduler.service';

describe('TasksSchedulerService', () => {
    let service: TasksSchedulerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TasksSchedulerService],
        }).compile();

        service = module.get<TasksSchedulerService>(TasksSchedulerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
