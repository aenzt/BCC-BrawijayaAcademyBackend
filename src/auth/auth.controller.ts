import { Body, Controller, Get, Post, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { loginUserDto } from 'src/auth/dto/loginUser.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { hasRoles } from './decorators/roles.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  @ApiCreatedResponse({ description: 'Login Success'})
  @ApiBadRequestResponse({ description: 'Bad Request'})
  async login(@Body() user: loginUserDto) {
    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Create User' })
  @ApiCreatedResponse({ description: 'User created successfully', type: User })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async postRegister(@Body() user: CreateUserDto) {
    const createdUser = await this.authService.create(user);
    return { statusCode: HttpStatus.CREATED, message: 'User created successfully', data: createdUser };
  }

  @Get('seed')
  @ApiOperation({summary: "Seed categories table for FIRST TIME USE ONLY" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles('admin')
  async seed() {
      return this.authService.seed();
  }
}
