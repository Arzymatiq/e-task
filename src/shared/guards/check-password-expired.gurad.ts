import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ERROR_MESSAGES } from 'src/constants/errors-message';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CheckPasswordExpiredGuard implements CanActivate {
    constructor(@Inject(UserService) private userService: UserService) {}

    checkPasswordExpired(lastChange: Date): boolean {
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        const lastChangeOnSeconds = new Date(lastChange);
        const now = new Date();

        return now.getTime() - lastChangeOnSeconds.getTime() > thirtyDays;
    }

    async handlePasswordExpiration(userId: string) {
        await this.userService.update(userId, { isPasswordDateExpired: true });
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const url = request.url;

        const isExpired = this.checkPasswordExpired(user.lastPasswordChangeDate);

        if (isExpired && !url.startsWith('/api/user/password')) {
            await this.handlePasswordExpiration(user.id);
            throw new ForbiddenException(ERROR_MESSAGES.ru.PASSWORD_EXPIRED);
        }

        return true;
    }
}
