import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/createTodo.dto';
import { TodoService } from './todo.service';
import { Todo } from '../entities/todo.entity';
import { UserService } from '../user/user.service';
import { User } from '../entities/user.entity';
import { Message } from '../type/message';

@Controller('todo')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async createTodo(@Body() createTodoDto: CreateTodoDto): Promise<Message> {
    const user = await this.userService.findUserWithId(createTodoDto.id);
    await this.todoService.createTodo(user, createTodoDto);
    return { message: 'created successfully' };
  }

  @Get()
  async getTodos(): Promise<Todo[]> {
    return await this.todoService.findAllTodo();
  }

  @Get('todoId')
  async getUsername(@Param('todoId') todoId: string): Promise<User> {
    return await this.todoService.findUserTodo(todoId);
  }

  @Put('todoId')
  async updateisDone(@Param('todoId') todoId: string): Promise<Message> {
    await this.todoService.updateisDone(todoId);
    return { message: 'updated successfully' };
  }

  @Delete('todoId')
  async deleteTodo(@Param('todoId') todoId: string): Promise<Message> {
    await this.todoService.deleteTodo(todoId);
    return { message: 'deleted successfully' };
  }
}
