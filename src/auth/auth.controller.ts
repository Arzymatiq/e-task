import {
    Body,
    Controller,
    HttpCode,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, RefreshTokenDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('login')
    async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
        const response = await this.authService.login(dto);
        // console.log('refreshToken', refreshToken);
        // this.authService.addRefreshTokenToResponse(res, refreshToken);
        return response;
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    // @Post('register')
    // async register(
    //   @Body() dto: AuthDto,
    //   @Res({ passthrough: true }) res: Response,
    // ) {
    //   const { refreshToken, ...response } = await this.authService.register(dto);
    //   return response;
    // }
    @Post('refresh-tokens')
    async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Body() dto: RefreshTokenDto) {
        // const refreshTokenFromCookie =
        //   req.cookies[this.authService.REFRESH_TOKEN_NAME];

        // console.log('refreshTokenFromCookie', refreshTokenFromCookie);

        const { refreshToken } = dto;

        if (!refreshToken) {
            this.authService.removeRefreshTokenToResponse(res);
            throw new UnauthorizedException('refresh token not passed');
        }

        const response = await this.authService.refreshTokens(refreshToken);
        this.authService.addRefreshTokenToResponse(res, refreshToken);
        return response;
    }

    @HttpCode(200)
    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        this.authService.removeRefreshTokenToResponse(res);
        return true;
    }
}
