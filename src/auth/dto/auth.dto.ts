import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNotEmpty, IsBoolean } from 'class-validator';

export class AuthDto {
    @ApiProperty({ default: 'name' })
    @IsNotEmpty()
    login: string;
    @IsString()
    @MinLength(6, {
        message: 'must be 6 symbols',
    })
    @ApiProperty({ default: '1234576' })
    password: string;

    @ApiProperty({ default: false })
    @IsNotEmpty()
    @IsBoolean()
    isAgreeToManagmentData: boolean;
}

export class RefreshTokenDto {
    @ApiProperty()
    @IsNotEmpty()
    refreshToken: string;
}
