import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from '../entities/todo.entity';
import { TodoService } from './todo.service';
import { TodoRepository } from './todo.repository';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [TodoController],
  providers: [
    TodoService,
    TodoRepository,
    UserService,
    UserRepository,
    JwtService,
  ],
})
export class TodoModule {}
