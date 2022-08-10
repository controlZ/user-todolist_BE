import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateTodoDto } from './dto/createTodo.dto';
import { Todo } from '../entities/todo.entity';
import { TodoRepository } from './todo.repository';
import { User } from '../entities/user.entity';

@Injectable()
export class TodoService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly todoRepository: TodoRepository,
  ) {}

  async createTodo(user: User, createTodoDto: CreateTodoDto): Promise<void> {
    await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        await this.todoRepository.createTodo(
          user,
          createTodoDto,
          transactionalEntityManager,
        );
      },
    );
  }

  async findAllTodo(): Promise<Todo[]> {
    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        return await this.todoRepository.findAllTodo(
          transactionalEntityManager,
        );
      },
    );
  }

  async findUserTodo(userId: string): Promise<User> {
    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        return await this.todoRepository.findUserTodo(
          userId,
          transactionalEntityManager,
        );
      },
    );
  }

  async updateisDone(id: string): Promise<void> {
    await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        await this.todoRepository.updateisDone(id, transactionalEntityManager);
      },
    );
  }

  async deleteTodo(id: string): Promise<void> {
    await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        await this.todoRepository.deleteTodo(id, transactionalEntityManager);
      },
    );
  }
}
