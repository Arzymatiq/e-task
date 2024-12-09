import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ERROR_MESSAGES } from 'src/constants/errors-message';

export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info, context: ExecutionContext) {
        if (!user) {
            throw new UnauthorizedException(ERROR_MESSAGES.ru.UNAUTHORIZED);
        }
        if (!user.active) {
            throw new UnauthorizedException(ERROR_MESSAGES.ru.USER_NOT_ACTIVE);
        }

        return user;
    }
}
