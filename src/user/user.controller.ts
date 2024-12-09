import { CreateUserDto } from './dto/create-user.dto';
import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Patch,
    Post,
    Put,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateOptions } from 'src/shared/decorators/paginate.decorator';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';
import { CheckPasswordExpired } from 'src/shared/decorators/check-password-expired.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // @Auth()
    // @ApiBearerAuth()
    // @CheckPasswordExpired()
    // @Roles(RoleEnum.Admin)
    @Post()
    @UsePipes(new ValidationPipe())
    async createUser(@Body() dto: CreateUserDto) {
        if (dto.roleId == 3 && !dto.responsibleId) {
            throw new HttpException('responsibleId not found', HttpStatus.BAD_REQUEST);
        }
        const { password, ...user } = await this.userService.create(dto);
        return user;
    }

    @Auth()
    @ApiBearerAuth()
    @CheckPasswordExpired()
    @Roles(RoleEnum.Admin)
    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        const { password, ...user } = await this.userService.update(id, dto);
        return user;
    }

    @Auth()
    @ApiBearerAuth()
    @Patch('password/:id')
    async updatePassword(@Param('id') id: string, @Body() dto: UpdateUserPasswordDto) {
        const { password, ...user } = await this.userService.update(id, dto);
        return user;
    }

    @Auth()
    @ApiBearerAuth()
    @CheckPasswordExpired()
    @Roles(RoleEnum.Admin)
    @Get()
    findAll(@Paginate() paginateOptions: PaginateOptions) {
        const { page, perPage } = paginateOptions;
        return this.userService.findAll({ page, perPage });
    }

    @Auth()
    @ApiBearerAuth()
    @CheckPasswordExpired()
    @Roles(RoleEnum.Admin)
    @Patch('active/:id')
    active(@Param('id') id: string) {
        return this.userService.changeUserActivity(id, true);
    }

    @Auth()
    @ApiBearerAuth()
    @CheckPasswordExpired()
    @Roles(RoleEnum.Admin)
    @Patch('block/:id')
    block(@Param('id') id: string) {
        return this.userService.changeUserActivity(id, false);
    }
}
