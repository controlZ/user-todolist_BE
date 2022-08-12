import { Todo } from '../entities/todo.entity';

export interface CreateUser {
  id: string;
  username: string;
  email: string;
  todos: Todo[];
}
