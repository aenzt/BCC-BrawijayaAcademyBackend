import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  create(createCourseDto: CreateCourseDto) {
    const course = new Course();
    course.name = createCourseDto.courseName;
    course.description = createCourseDto.courseDescription;
    course.body = createCourseDto.courseBody;
    course.playlistLink = createCourseDto.coursePlaylistLink;

    return this.courseRepository.save(course);
  }

  async findAll() {
    const course = await this.courseRepository.find();
    if (course.length < 1) {
      throw new HttpException('No course found', HttpStatus.NOT_FOUND);
    }
    return course;
  }

  async findOne(id: number) {
    const course = await this.courseRepository.findOne(id);
    if (!course) {
      throw new HttpException(
        `Course with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseRepository.findOne(id)
    if (!course) {
        throw new HttpException(
          `Course with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
    if (updateCourseDto.courseName){
        course.name = updateCourseDto.courseName
    }
    if(updateCourseDto.courseDescription){
        course.description = updateCourseDto.courseDescription
    }
    if(updateCourseDto.courseBody){
        course.body = updateCourseDto.courseBody
    }
    if(updateCourseDto.coursePlaylistLink){
        course.playlistLink = updateCourseDto.coursePlaylistLink
    }

    return this.courseRepository.save(course);
  }

  async remove(id: number) {
    const course = await this.courseRepository.findOne(id);
    if (!course) {
      throw new HttpException(
        `Course with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return this.courseRepository.remove(course);
  }
}
