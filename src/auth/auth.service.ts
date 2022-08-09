import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { Todo } from '../entities/todo.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    userEmail: string,
    password: string,
  ): Promise<{ id: string; username: string; email: string; todos: Todo[] }> {
    const user = await this.userService.findUseremail(userEmail);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = { name: user.username, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
