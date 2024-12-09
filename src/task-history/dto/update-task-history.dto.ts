import { PartialType } from '@nestjs/swagger';
import { CreateTaskHistoryDto } from './create-task-history.dto';

export class UpdateTaskHistoryDto extends PartialType(CreateTaskHistoryDto) {}
