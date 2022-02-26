import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/createUser.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
}
