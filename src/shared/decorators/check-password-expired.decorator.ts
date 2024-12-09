import { UseGuards, applyDecorators } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CheckPasswordExpiredGuard } from '../guards/check-password-expired.gurad';

export const CheckPasswordExpired = () => {
    return applyDecorators(UseGuards(JwtAuthGuard, CheckPasswordExpiredGuard));
};
