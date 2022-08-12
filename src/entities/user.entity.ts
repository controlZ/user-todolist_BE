import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Todo } from './todo.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  username: string;

  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar')
  password: string;

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;

  @OneToMany((type) => Todo, (todo) => todo.user, { cascade: true })
  todos: Todo[];
}
