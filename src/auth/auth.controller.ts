import { Controller, UseGuards, Post, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { Login } from '../type/login';
import { Validate } from '../type/validate';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<Login> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/usertodo')
  getUserTodo(@Request() req): Promise<Validate> {
    return req.user;
  }
}
