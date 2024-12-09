import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { Status } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateTaskDto extends PartialType(OmitType(CreateTaskDto, ['responsibleIds'] as const)) {
    @IsNotEmpty()
    @ApiProperty({ enum: Status })
    status?: Status;
    responsibleIds?: string;
    endDate?: Date;
    extensionRequestedStatus?: Status;
    newDeadline?: Date;
    executerFullName?: string;
}

export class AddNoteDto {
    @IsOptional()
    @ApiProperty({ default: 'note to task' })
    note?: Status;
}
