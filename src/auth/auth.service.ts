import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ValidateUser } from '../type/validateUser';
import { ConfigService } from '@nestjs/config';
import { GetAccessToken, GetRefreshToken, Option } from '../type/auth';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    userEmail: string,
    password: string,
  ): Promise<ValidateUser> {
    const user = await this.userService.findUserWithEmail(userEmail);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async getCookieWithJwtAccessToken(id: string): Promise<GetAccessToken> {
    const payload = { id };
    const token: string = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN__EXPIRATION_TIME',
      )}s`,
    });
    return {
      accessToken: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      maxAge:
        Number(this.configService.get('JWT_ACCESS_TOKEN__EXPIRATION_TIME')) *
        1000,
    };
  }

  async getCookieWithJwtRefreshToken(id: string): Promise<GetRefreshToken> {
    const payload = { id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN__EXPIRATION_TIME',
      )}s`,
    });
    return {
      refreshToken: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      maxAge:
        Number(this.configService.get('JWT_REFRESH_TOKEN__EXPIRATION_TIME')) *
        1000,
    };
  }

  async getCookiesForLogOut(): Promise<Option> {
    return {
      accessOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
      refreshOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
    };
  }
}
