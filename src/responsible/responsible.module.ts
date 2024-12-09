import { Module } from '@nestjs/common';
import { ResponsibleService } from './responsible.service';
import { ResponsibleController } from './responsible.controller';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
    controllers: [ResponsibleController],
    providers: [ResponsibleService, PrismaService, UserService],
})
export class ResponsibleModule {}
