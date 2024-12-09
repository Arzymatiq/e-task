import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: number[]) => {
    return applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(JwtAuthGuard, RolesGuard));
};
