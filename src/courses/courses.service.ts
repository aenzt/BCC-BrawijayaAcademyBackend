import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private categoryService: CategoriesService,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const course = new Course();
    course.name = createCourseDto.name;
    course.description = createCourseDto.description;
    course.body = createCourseDto.body;
    course.playlistLink = createCourseDto.playlistLink;
    const category = await this.categoryService.findOne(createCourseDto.categoryId);
    course.categories = [category];
    return this.courseRepository.save(course);
  }

  async findAll() {
    const course = await this.courseRepository.find({relations: ["categories"]});
    if (course.length < 1) {
      throw new HttpException('No course found', HttpStatus.NOT_FOUND);
    }
    return course;
  }

  async findOne(id: number) {
    const course = await this.courseRepository.findOne(id, {relations: ["categories"]});
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
    if (updateCourseDto.name){
        course.name = updateCourseDto.name
    }
    if(updateCourseDto.description){
        course.description = updateCourseDto.description
    }
    if(updateCourseDto.body){
        course.body = updateCourseDto.body
    }
    if(updateCourseDto.playlistLink){
        course.playlistLink = updateCourseDto.playlistLink
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
