import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { loginUserDto } from './dto/loginUser.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  @ApiCreatedResponse({ description: 'Login Success' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async login(@Body() user: loginUserDto) {
    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Create User' })
  @ApiCreatedResponse({ description: 'User created successfully', type: User })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async postRegister(@Body() user: CreateUserDto) {
    const createdUser = await this.authService.create(user);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: createdUser,
    };
  }
}
