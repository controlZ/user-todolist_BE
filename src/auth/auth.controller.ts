import {
  Controller,
  UseGuards,
  Post,
  Request,
  Get,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAccessGuard } from './jwt-access.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { Validate } from '../type/validate';
import { UserService } from '../user/user.service';
import { Response } from 'express';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { User } from '../entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const user = req.user;
    const { accessToken, ...accessOption } =
      await this.authService.getCookieWithJwtAccessToken(user.id);

    const { refreshToken, ...refreshOption } =
      await this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.userService.setCurrentRefreshToken(refreshToken, user.id);

    res.cookie('Authentication', accessToken, accessOption);
    res.cookie('Refresh', refreshToken, refreshOption);

    return user;
  }

  @UseGuards(JwtAccessGuard)
  @Get('usertodo')
  getUserTodo(@Request() req): Promise<Validate> {
    return req.user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const user = req.user;
    const { accessToken, ...accessOption } =
      await this.authService.getCookieWithJwtAccessToken(user.id);
    res.cookie('Authentication', accessToken, accessOption);
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  async logOut(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { accessOption, refreshOption } =
      await this.authService.getCookiesForLogOut();

    await this.userService.removeRefreshToken(req.user.id);

    res.cookie('Authentication', '', accessOption);
    res.cookie('Refresh', '', refreshOption);
  }
}
