import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    isPasswordDateExpired?: boolean;
}
export class UpdateUserPasswordDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(6, {
        message: 'must be 6 symbols',
    })
    @ApiProperty({ default: '123456' })
    password: string;
}
