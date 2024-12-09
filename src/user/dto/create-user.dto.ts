import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ default: 'login' })
    @IsNotEmpty()
    login: string;

    @ApiProperty({ default: 'fullName' })
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @MinLength(6, {
        message: 'must be 6 symbols',
    })
    @ApiProperty({ default: '1234576' })
    password: string;

    @ApiProperty({ default: 1 })
    roleId: number;

    @ApiProperty({ default: null })
    responsibleId: string;
}
