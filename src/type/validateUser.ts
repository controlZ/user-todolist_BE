import { Todo } from '../entities/todo.entity';

export interface ValidateUser {
  id: string;
  username: string;
  email: string;
  todos: Todo[];
}
