import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/createTodo.dto';
import { EntityManager } from 'typeorm';
import { Todo } from '../entities/todo.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class TodoRepository {
  async createTodo(
    user: User,
    createTodoDto: CreateTodoDto,
    transactionalEntityManager: EntityManager,
  ): Promise<void> {
    const todoRepository = transactionalEntityManager.getRepository(Todo);
    const todos = new Todo();
    todos.task = createTodoDto.task;
    todos.user = user;
    await todoRepository.save(todos);
  }

  async findAllTodo(
    transactionalEntityManager: EntityManager,
  ): Promise<Todo[]> {
    const todoRepository = transactionalEntityManager.getRepository(Todo);
    const Todolist = await todoRepository.find({ relations: ['user'] });
    return Todolist;
  }

  async findUserTodo(
    userId: string,
    transactionalEntityManager: EntityManager,
  ): Promise<User> {
    const userRepository = transactionalEntityManager.getRepository(User);
    const userTodo = await userRepository.findOne({
      relations: { todos: true },
      where: { id: userId },
    });
    return userTodo;
  }

  async updateisDone(
    id: string,
    transactionalEntityManager: EntityManager,
  ): Promise<void> {
    const todoRepository = transactionalEntityManager.getRepository(Todo);
    const before = await todoRepository.findOne({ where: { id: id } });
    await todoRepository.update(id, { isDone: !before.isDone });
  }

  async deleteTodo(
    id: string,
    transactionalEntityManager: EntityManager,
  ): Promise<void> {
    const todoRepository = transactionalEntityManager.getRepository(Todo);
    await todoRepository.delete(id);
  }
}
