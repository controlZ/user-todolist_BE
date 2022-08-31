import {
  Controller,
  Post,
  Param,
  Put,
  Body,
  Delete,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from '../entities/user.entity';
import { Message } from '../type/message';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('join')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<Message> {
    await this.userService.createUser(createUserDto);
    return { message: 'created successfully' };
  }

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.userService.findAllUser();
  }

  @Get('userId')
  async getUsername(@Param('userId') id: string): Promise<User> {
    return await this.userService.findUserWithId(id);
  }

  @Put('userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser(userId, updateUserDto);
  }

  @Delete('userId')
  async deleteUser(@Param('userId') userId: string): Promise<Message> {
    await this.userService.deleteUser(userId);
    return { message: 'deleted successfully' };
  }
}
