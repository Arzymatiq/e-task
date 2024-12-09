import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateResponsibleDto {
    @ApiProperty({ default: 'ФКФ' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ default: 'ФКФ' })
    @IsString()
    @IsNotEmpty()
    longName: string;
}
