import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RequestExtenstionDto {
    @ApiProperty({ default: 'Причина запроса' })
    @IsNotEmpty()
    reason: string;

    @ApiProperty({ default: '2024-08-20T12:01:27.196Z' })
    @IsNotEmpty()
    newDeadline: Date;
}
