import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { ResponsibleService } from './responsible.service';
import { CreateResponsibleDto } from './dto/create-responsible.dto';
import { UpdateResponsibleDto } from './dto/update-responsible.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RoleEnum } from 'src/enums/role.enum';
import { CheckPasswordExpired } from 'src/shared/decorators/check-password-expired.decorator';

@ApiTags('responsilblity')
@Controller('responsible')
export class ResponsibleController {
    constructor(private readonly responsibleService: ResponsibleService) {}

    @Auth()
    @ApiBearerAuth()
    @Roles(RoleEnum.Admin)
    @CheckPasswordExpired()
    @Post()
    @UsePipes(new ValidationPipe())
    create(@Body() createResponsibleDto: CreateResponsibleDto) {
        return this.responsibleService.create(createResponsibleDto);
    }

    @Auth()
    @ApiBearerAuth()
    @Roles(RoleEnum.Admin, RoleEnum.Creator, RoleEnum.SuperUser)
    @CheckPasswordExpired()
    @Get()
    findAll() {
        return this.responsibleService.findAll();
    }

    @Roles(RoleEnum.Admin, RoleEnum.Creator, RoleEnum.SuperUser)
    @CheckPasswordExpired()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.responsibleService.findOne(+id);
    }

    @Auth()
    @ApiBearerAuth()
    @Roles(RoleEnum.Admin)
    @CheckPasswordExpired()
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateResponsibleDto) {
        return this.responsibleService.update(id, dto);
    }

    @Auth()
    @ApiBearerAuth()
    @Roles(RoleEnum.Admin)
    @CheckPasswordExpired()
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.responsibleService.remove(id);
    }
}
