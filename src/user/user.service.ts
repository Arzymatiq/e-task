import { ForbiddenException, Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginatorTypes, paginator } from '@nodeteam/nestjs-prisma-pagination';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleEnum } from 'src/enums/role.enum';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 200 });
@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    getById(id: string) {
        return this.prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                responsible: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    }

    getRole(id: number) {
        return this.prisma.user.findMany({
            where: {
                roleId: id,
            },
        });
    }

    getByLogin(login: string) {
        return this.prisma.user.findUnique({
            where: {
                login,
            },
            include: {
                responsible: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    }

    async create(dto: CreateUserDto) {
        const superUsers = await this.getRole(RoleEnum.SuperUser);

        if (superUsers?.length && dto.roleId === RoleEnum.SuperUser)
            throw new ForbiddenException('Super user already existed');

        const user = {
            ...dto,
            password: await hash(dto.password),
        };

        return this.prisma.user.create({
            data: user,
        });
    }

    async update(id: string, dto: UpdateUserDto) {
        return this.prisma.user.update({
            where: { id },
            data: dto.password
                ? {
                      ...dto,
                      password: await hash(dto.password),
                      lastPasswordChangeDate: new Date(),
                      isPasswordDateExpired: false,
                  }
                : dto,
        });
    }

    async changeUserActivity(id: string, isActive: boolean) {
        return this.prisma.user.update({
            where: { id },
            data: { active: isActive },
        });
    }

    async findAll({ perPage, page }: { page: number; perPage }) {
        return paginate(
            this.prisma.user,
            {
                select: {
                    id: true,
                    roleId: true,
                    role: {
                        select: {
                            name: true,
                        },
                    },
                    login: true,
                    fullName: true,
                    active: true,
                    password: false,
                    responsibleId: true,
                    responsible: {
                        select: {
                            name: true,
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                },
            },
            {
                page,
                perPage,
            },
        );
    }
}
