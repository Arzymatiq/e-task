import { Injectable, Delete } from '@nestjs/common';
import { CreateResponsibleDto } from './dto/create-responsible.dto';
import { UpdateResponsibleDto } from './dto/update-responsible.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ResponsibleService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateResponsibleDto) {
        return await this.prisma.responsible.create({ data: dto });
    }

    async findAll() {
        return await this.prisma.responsible.findMany();
    }

    findOne(id: number) {
        return `This action returns a #${id} responsible`;
    }

    update(id: string, dto: UpdateResponsibleDto) {
        return this.prisma.responsible.update({ where: { id }, data: dto });
    }

    remove(id: string) {
        return this.prisma.responsible.delete({ where: { id } });
    }
}
