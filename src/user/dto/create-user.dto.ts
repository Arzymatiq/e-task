import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    login: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @MinLength(6, {
        message: 'must be 6 symbols',
    })
    @ApiProperty({ default: 1 })
    roleId: number;

    @ApiProperty({ default: null })
    responsibleId: string;
}
