import { PartialType } from '@nestjs/swagger';
import { CreateTaskNoteDto } from './create-task-note.dto';

export class UpdateTaskNoteDto extends PartialType(CreateTaskNoteDto) {}
