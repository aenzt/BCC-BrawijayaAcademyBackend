import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Controller('courses')
@ApiTags('courses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @ApiOperation({ summary: 'Create Course' })
  @ApiCreatedResponse({ description: 'User created successfully', type: Course })
  @ApiBadRequestResponse({ description: 'Bad Request'})
  create(@Body() createCourseDto: CreateCourseDto, @Req() req) {
    return this.coursesService.create(createCourseDto, req.user.nim);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Course' })
  @ApiCreatedResponse({ description: 'Get all course success'})
  @ApiBadRequestResponse({ description: 'Bad Request'})
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one course' })
  @ApiCreatedResponse({ description: 'Get one course success'})
  @ApiBadRequestResponse({ description: 'Bad Request'})
  findOne(@Param('id') id: string, @Req() req) {
    return this.coursesService.findOne(+id, req.user.nim);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(+id);
  }

  @Get(':id/buy')
  buy(@Param('id') id: string, @Req() req){
      return this.coursesService.buy(+id, req.user.nim);
  }
}
