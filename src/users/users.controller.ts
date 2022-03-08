import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UsersService } from './users.service';

@Controller()
@ApiTags('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/profile')
  @ApiOperation({summary: "Get logged in user profile" })
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return this.userService.findOne(req.user.nim);
  }

  @Get('/user')
  @ApiOperation({summary: "Get all user for ADMIN ONLY" })
  @hasRoles('admin')
  findAll() {
    return this.userService.findAll();
  }

  @Get('user/:id')
  @ApiOperation({summary: "Get one user by ID for ADMIN ONLY" })
  @hasRoles('admin')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    if (!user) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Patch('user/:id')
  @ApiOperation({summary: "Edit one user by ID for ADMIN ONLY" })
  @hasRoles('admin')
  update(@Param('id') id: string) {
    return 'Update user not allowed';
  }

  @Delete('user/:id')
  @ApiOperation({summary: "Delete one user by ID for ADMIN ONLY" })
  @hasRoles('admin')
  delete(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }
}
