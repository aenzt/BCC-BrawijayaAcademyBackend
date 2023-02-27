import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async findOne(nim: number): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { nim },
      relations: ['role', 'coursesOwned'],
    });
  }

  async findOneWithoutRelation(nim: number): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ nim });
  }

  async update(nim: number, user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async checkCourse(user: User, course: Course) {
    const userCourse = user.coursesOwned.find((c) => c.id === course.id);
    if (userCourse) {
      return true;
    }
    return false;
  }

  async seed() {
    const roleInDb = await this.rolesRepository.find();
    if (roleInDb) {
      throw new HttpException('Already Seeded', HttpStatus.CONFLICT);
    }
    const role = new Role();
    role.name = 'admin';
    await this.rolesRepository.save(role);
    role.name = 'instructor';
    await this.rolesRepository.save(role);
    role.name = 'user';
    await this.rolesRepository.save(role);
  }

  async checkRole(nim: number, roles: string[]) {
    const user = await this.usersRepository.findOne({
      where: { nim },
      relations: ['role'],
    });
    for (const role of roles) {
      if (user.role.name === role) {
        return true;
      }
    }
    return false;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['role'] });
  }

  async deleteUser(nim: number) {
    const user = await this.usersRepository.findOneBy({ nim });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const removed = await this.usersRepository.remove(user);
    return {
      message: 'User deleted',
      data: removed,
    };
  }

  async updateRole(role: string, nim: number) {
    const user = await this.usersRepository.findOne({
      where: { nim: nim },
      relations: ['role'],
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const roleToUpdate = await this.rolesRepository.findOne({
      where: { name: role },
    });
    if (!roleToUpdate) {
      throw new HttpException('Role not found', HttpStatus.BAD_REQUEST);
    }
    user.role = roleToUpdate;
    const updated = await this.usersRepository.save(user);
    return {
      message: 'User role updated',
      data: updated,
    };
  }
}
