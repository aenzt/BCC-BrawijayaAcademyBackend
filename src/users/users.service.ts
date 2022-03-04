import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOne(nim: number): Promise<User | undefined> {
    return this.usersRepository.findOne(nim, {
        relations: ['coursesOwned'],
    });
  }

  async update(nim: number, user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async checkCourse(user : User, course: Course){
    const userCourse = user.coursesOwned.find(c => c.id === course.id);
    if(userCourse){
      return true;
    }
    return false;
  }
}
