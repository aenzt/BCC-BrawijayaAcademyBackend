import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
        const category = new Category();
        category.name = createCategoryDto.name;
        const created = await this.categoryRepository.save(category);
        return {
            data: created,
            message: 'Create category success',
        }
    } catch (error) {
        if(error.code === "ER_DUP_ENTRY"){
            throw new HttpException("This category already exist!", HttpStatus.BAD_REQUEST);
        }
        throw new HttpException("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    const categories = await this.categoryRepository.find();
    if (categories.length < 1) {
        throw new HttpException('No categories found', HttpStatus.NOT_FOUND);
      }
      return {
        data: categories,
        message: 'Get all categories success',
    };
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne(id);
    if (!category) {
      throw new HttpException(
        `Category with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne(id);
    if (!category) {
        throw new HttpException(
          `Category with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
    }
    if (updateCategoryDto.name){
        category.name = updateCategoryDto.name
    }
    return this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOne(id);
    if (!category) {
        throw new HttpException(
          `Category with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
    }
    const removed = await this.categoryRepository.remove(category);
    return {
        data: removed,
        message: 'Delete category success',
    }
  }
}
