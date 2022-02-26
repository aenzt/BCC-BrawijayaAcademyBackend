import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { loginUserDto } from 'src/auth/dto/loginUser.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() user: loginUserDto) {
    return this.authService.login(user);
  }

  @Post('register')
  async postRegister(@Body() user: CreateUserDto) {
    const createdUser = await this.authService.create(user);
    return { message: 'User created successfully', data: createdUser };
  }
}
