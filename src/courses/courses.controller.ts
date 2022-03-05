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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Controller('courses')
@ApiTags('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @ApiOperation({ summary: 'Create Course' })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: Course,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @hasRoles('instructor', 'admin')
  create(@Body() createCourseDto: CreateCourseDto, @Req() req) {
    return this.coursesService.create(createCourseDto, req.user.nim);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Course' })
  @ApiCreatedResponse({ description: 'Get all course success' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one course' })
  @ApiCreatedResponse({ description: 'Get one course success' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  findOne(@Param('id') id: string, @Req() req) {
    return this.coursesService.findOne(+id, req.user.nim);
  }

  @Patch(':id')
  @hasRoles('instructor', 'admin')
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Req() req,
  ) {
    return this.coursesService.update(+id, updateCourseDto, req.user.nim);
  }

  @Delete(':id')
  @hasRoles('instructor', 'admin')
  remove(@Param('id') id: string, @Req() req) {
    return this.coursesService.remove(+id, req.user.nim);
  }

  @Get(':id/buy')
  @hasRoles('user', 'admin')
  buy(@Param('id') id: string, @Req() req) {
    return this.coursesService.buy(+id, req.user.nim);
  }
}
