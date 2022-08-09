import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  task: string;

  @Column({ type: 'boolean', default: false })
  isDone: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne((type) => User, (user) => user.todos, { onDelete: 'CASCADE' })
  user: User;
}
