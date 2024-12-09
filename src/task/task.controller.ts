import { CheckTaskStatus } from './../shared/decorators/check-task-status.decorator';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AddNoteDto, UpdateTaskDto } from './dto/update-task.dto';
import { Paginate, PaginateOptions } from 'src/shared/decorators/paginate.decorator';
import { Status } from '@prisma/client';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from 'src/shared/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { TaskHistoryService } from 'src/task-history/task-history.service';
import { TaskNoteService } from 'src/task-note/task-note.service';
import { RequestExtenstionDto } from './dto/request-extenstion.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';
import { StatusEnumString } from 'src/enums/status.enum';
import { CheckPasswordExpired } from 'src/shared/decorators/check-password-expired.decorator';

@ApiTags('Task')
@Controller('task')
export class TaskController {
    constructor(
        private readonly taskService: TaskService,
        private readonly taskHistoryService: TaskHistoryService,
        private readonly taskNoteService: TaskNoteService,
    ) {}

    @Auth()
    @ApiBearerAuth()
    @Roles(RoleEnum.Creator, RoleEnum.SuperUser)
    @CheckPasswordExpired()
    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() dto: CreateTaskDto, @User() user) {
        const tasks = [];

        for (const id of dto.responsibleIds) {
            const task = await this.taskService.create(dto, user.id, id);
            tasks.push(task);
        }

        return tasks;
    }

    @Auth()
    @ApiBearerAuth()
    @CheckPasswordExpired()
    @Roles(RoleEnum.Creator, RoleEnum.Executor, RoleEnum.SuperUser, RoleEnum.Viewer)
    @Get('getCountByStatuses')
    async getCountByStatus() {
        return await this.taskService.findManyByStatus();
    }

    @Auth()
    @ApiBearerAuth()
    @CheckPasswordExpired()
    @Roles(RoleEnum.Creator, RoleEnum.Executor, RoleEnum.SuperUser, RoleEnum.Viewer)
    @ApiQuery({ name: 'page', description: 'Page number' })
    @ApiQuery({
        name: 'perPage',
        description: 'Items per page',
    })
    @ApiQuery({
        name: 'taskNumber',
        required: false,
        description: 'task number',
    })
    @ApiQuery({ name: 'taskText', required: false, description: 'task text' })
    @ApiQuery({ name: 'taskStatus', enum: Status, required: false, description: 'Filter tasks by status' })
    @ApiQuery({ name: 'expired', required: false, description: 'expired tasks' })
    @Get()
    async findAll(
        @Paginate() paginateOptions: PaginateOptions,
        @User() user,
        @Query('taskNumber') taskNumber?: string,
        @Query('taskText') taskText?: string,
        @Query('taskStatus') taskStatus?: Status,
        @Query('expired') expired?: string,
    ) {
        const { page, perPage } = paginateOptions;

        const isExpired = expired === 'true';

        return this.taskService.findAll({
            page,
            perPage,
            taskNumber,
            taskText,
            responsibleId: user?.responsibleId,
            taskStatus,
            isExpired,
        });
    }

    @Auth()
    @ApiBearerAuth()
    @Roles(RoleEnum.Creator, RoleEnum.Executor, RoleEnum.SuperUser, RoleEnum.Viewer)
    @CheckPasswordExpired()
    @Get(':id')
    async findOne(@Param('id') id: string, @User() user) {
        const task = await this.taskService.findOne(id);
        return task;
    }

    @Auth()
    @ApiBearerAuth()
    @Roles(RoleEnum.Creator, RoleEnum.Executor, RoleEnum.SuperUser, RoleEnum.Viewer)
    @CheckPasswordExpired()
    @Get('history/:id')
    findTaskHistory(@Param('id') id: string, @User() user) {
        return this.taskHistoryService.findMany(id);
    }

    @Auth()
    @ApiBearerAuth()
    @Roles(RoleEnum.Creator, RoleEnum.Executor, RoleEnum.SuperUser, RoleEnum.Viewer)
    @CheckPasswordExpired()
    @Get('notes/:id')
    findTaskNotes(@Param('id') id: string, @User() user) {
        return this.taskNoteService.findMany(id);
    }

    @Auth()
    @ApiBearerAuth()
    @Roles(RoleEnum.Creator, RoleEnum.Executor, RoleEnum.SuperUser, RoleEnum.Viewer)
    @CheckPasswordExpired()
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @User() user) {
        return this.taskService.update(id, updateTaskDto, user.login, user.fullName);
    }

    @Auth()
    @ApiBearerAuth()
    @Roles(RoleEnum.Executor)
    @CheckTaskStatus(StatusEnumString.CREATED)
    @CheckPasswordExpired()
    @Patch('takeConsideration/:id')
    takeConsideration(@Param('id') id: string, @User() user) {
        return this.taskService.updateTaskStatus(id, Status.IN_PROCCESS, user.login, user.fullName);
    }

    @Auth()
    @ApiBearerAuth()
    @Roles(RoleEnum.Executor)
    @CheckPasswordExpired()
    @CheckTaskStatus(
        StatusEnumString.IN_PROCCESS,
        StatusEnumString.APPROVE_REQUEST_EXTENSTION,
        StatusEnumString.REJECT_REQUEST_EXTENSTION,
        StatusEnumString.ROLLED_BACK,
    )
    @Patch('sendToConfirm/:id')
    async sendToConfirm(@Param('id') id: string, @Body() dto: AddNoteDto, @User() user) {
        await this.taskNoteService.create({
            taskId: id,
            createdDate: new Date(),
            noteBy: user.login,
            note: dto?.note,
            fullName: user.fullName,
        });
        const task = await this.taskService.updateTaskStatus(id, Status.SEND_TO_CONFIRM, user?.login, user.fullName);

        return task;
    }

    @Auth()
    @ApiBearerAuth()
    @CheckPasswordExpired()
    @Roles(RoleEnum.Creator, RoleEnum.Executor, RoleEnum.SuperUser, RoleEnum.Viewer)
    @Get('status/:id')
    async getStatus(@Param('id') id: string) {
        const task = await this.taskService.findOne(id);
        return task.status;
    }

    @Auth()
    @ApiBearerAuth()
    @CheckPasswordExpired()
    @Roles(RoleEnum.Creator, RoleEnum.SuperUser)
    @CheckTaskStatus(StatusEnumString.SEND_TO_CONFIRM)
    @Patch('complete/:id')
    async complete(@Param('id') id: string, @User() user) {
        const task = await this.taskService.updateTaskStatus(id, Status.DONE, user?.login, user.fullName);
        this.taskService.update(id, { endDate: new Date() }, user.login, user.fullName);
        return task;
    }

    @Auth()
    @ApiBearerAuth()
    @CheckPasswordExpired()
    @Roles(RoleEnum.Executor)
    @CheckTaskStatus(
        StatusEnumString.IN_PROCCESS,
        StatusEnumString.ROLLED_BACK,
        StatusEnumString.APPROVE_REQUEST_EXTENSTION,
        StatusEnumString.REJECT_REQUEST_EXTENSTION,
    )
    @Patch('requestExtenstion/:id')
    async requestExtenstion(@Param('id') id: string, @Body() body: RequestExtenstionDto, @User() user) {
        await this.taskService.updateTaskStatus(id, Status.REQUEST_EXTENSTION, user?.login, user.fullName);
        await this.taskNoteService.create({
            taskId: id,
            createdDate: new Date(),
            noteBy: user.login,
            note: body?.reason,
            fullName: user.fullName,
        });
        const task = await this.taskService.requestExtenstion(id, body.newDeadline);
        return task;
    }

    @Auth()
    @ApiBearerAuth()
    @CheckPasswordExpired()
    @Roles(RoleEnum.Creator, RoleEnum.SuperUser)
    @CheckTaskStatus(StatusEnumString.REQUEST_EXTENSTION)
    @Patch('approveRequestExtenstion/:id')
    async approveRequestExtenstion(@Param('id') id: string, @User() user) {
        await this.taskService.updateTaskStatus(id, Status.APPROVE_REQUEST_EXTENSTION, user?.login, user.fullName);
        await this.taskNoteService.create({
            taskId: id,
            createdDate: new Date(),
            noteBy: user.login,
            note: '',
            fullName: user.fullName,
        });
        const task = await this.taskService.approveRequestExtenstion(id, user.login, user.fullName);
        return task;
    }

    @Auth()
    @ApiBearerAuth()
    @CheckPasswordExpired()
    @Roles(RoleEnum.Creator, RoleEnum.SuperUser)
    @CheckTaskStatus(StatusEnumString.REQUEST_EXTENSTION)
    @Patch('rejectRequestExtenstion/:id')
    async rejectRequestExtenstion(@Param('id') id: string, @Body() dto: AddNoteDto, @User() user) {
        await this.taskService.updateTaskStatus(id, Status.REJECT_REQUEST_EXTENSTION, user?.login, user.fullName);
        await this.taskNoteService.create({
            taskId: id,
            createdDate: new Date(),
            noteBy: user.login,
            note: dto.note,
            fullName: user.fullName,
        });
        const task = await this.taskService.rejectRequestExtenstion(id, user.login, user.fullName);
        return task;
    }

    @Auth()
    @ApiBearerAuth()
    @CheckPasswordExpired()
    @Roles(RoleEnum.Creator, RoleEnum.SuperUser)
    @CheckTaskStatus(StatusEnumString.SEND_TO_CONFIRM)
    @Patch('rollBack/:id')
    async rollBack(@Param('id') id: string, @Body() dto: AddNoteDto, @User() user) {
        await this.taskNoteService.create({
            taskId: id,
            createdDate: new Date(),
            noteBy: user.login,
            note: dto?.note,
            fullName: user.fullName,
        });
        const task = await this.taskService.updateTaskStatus(id, Status.ROLLED_BACK, user?.login, user.fullName);

        return task;
    }

    @Auth()
    @ApiBearerAuth()
    @CheckPasswordExpired()
    @Roles(RoleEnum.Creator, RoleEnum.SuperUser)
    @CheckTaskStatus()
    @Patch('archive/:id')
    async archive(@Param('id') id: string, @Body() dto: AddNoteDto, @User() user) {
        await this.taskNoteService.create({
            taskId: id,
            createdDate: new Date(),
            noteBy: user.login,
            note: dto?.note,
            fullName: user.fullName,
        });
        const task = await this.taskService.updateTaskStatus(id, Status.ARCHIVE, user?.login, user.fullName);

        return task;
    }

    @Auth()
    @ApiBearerAuth()
    @CheckPasswordExpired()
    @Roles(RoleEnum.Creator)
    @CheckTaskStatus(StatusEnumString.CREATED)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.taskService.remove(id);
    }
}
