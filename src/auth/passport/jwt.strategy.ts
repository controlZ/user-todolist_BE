import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TodoRepository } from '../../todo/todo.repository';
import { UserRepository } from '../../user/user.repository';
import { DataSource } from 'typeorm';
import { Validate } from '../../type/validate';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly todoRepository: TodoRepository,
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<Validate> {
    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const Usertodos = await this.todoRepository.findUserTodo(
          payload.sub,
          transactionalEntityManager,
        );

        const { id, username, email, password, ...restUsertodos } = Usertodos;
        return restUsertodos;
      },
    );
  }
}
