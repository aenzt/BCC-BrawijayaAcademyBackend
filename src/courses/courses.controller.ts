import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { BaseResponseDTO } from 'src/responseDto/baseResponse.dto';
import { ErrorResponseDTO } from 'src/responseDto/errorResponse.dto';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { JoinCourseDto } from './dto/join-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Controller('courses')
@ApiTags('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
  type: ErrorResponseDTO,
})
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDTO })
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Course' })
  @ApiQuery({ name: 'Category', required: false })
  @ApiQuery({ name: 'CourseName', required: false })
  @ApiOkResponse({
    description: 'Get all course success',
    type: BaseResponseDTO,
  })
  findAll(
    @Query('Category') category?: string,
    @Query('CourseName') name?: string,
  ) {
    return this.coursesService.findAll(category, name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one course' })
  @ApiOkResponse({
    description: 'Get one course success',
    type: BaseResponseDTO,
  })
  findOne(@Param('id') id: string, @Req() req) {
    return this.coursesService.findOne(+id, req.user.nim);
  }

  @Get(':id/buy')
  @ApiOperation({ summary: 'Buy Course by ID' })
  buy(@Param('id') id: string, @Req() req) {
    return this.coursesService.buy(+id, req.user.nim);
  }

  @Post()
  @ApiOperation({ summary: 'Create Course' })
  @ApiOkResponse({
    description: 'User created successfully',
    type: Course,
  })
  @hasRoles('instructor', 'admin')
  create(@Body() createCourseDto: CreateCourseDto, @Req() req) {
    return this.coursesService.create(createCourseDto, req.user.nim);
  }

  @Post(':id/joininstructor')
  @hasRoles('instructor', 'admin')
  joinInstructor(
    @Param('id') id: string,
    @Req() req,
    @Body() joinCourseDto: JoinCourseDto,
  ) {
    return this.coursesService.joinInstructor(
      +id,
      req.user.nim,
      joinCourseDto.joinCode,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit one course for author' })
  @hasRoles('instructor', 'admin')
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Req() req,
  ) {
    return this.coursesService.update(+id, updateCourseDto, req.user.nim);
  }

  @Patch('admin/:id')
  @ApiOperation({ summary: 'Edit one course for admin' })
  @hasRoles('admin')
  updateAdmin(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.updateAdmin(+id, updateCourseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete one course for author' })
  @hasRoles('instructor', 'admin')
  remove(@Param('id') id: string, @Req() req) {
    return this.coursesService.remove(+id, req.user.nim);
  }

  @Delete('admin/:id')
  @ApiOperation({ summary: 'Delete one course for admin' })
  @hasRoles('admin')
  removeAdmin(@Param('id') id: string) {
    return this.coursesService.removeAdmin(+id);
  }
}
