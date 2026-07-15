import { Body, Controller, HttpCode, Post, UnauthorizedException } from '@nestjs/common';
import { DataService } from '../data/data.service';
import { Session } from '../data/types';

interface LoginDto {
  email?: string;
  password?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly data: DataService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginDto): Promise<Session> {
    const user = await this.data.findUser(body?.email ?? '', body?.password ?? '');
    if (!user) throw new UnauthorizedException('Invalid email or password');
    return { email: user.email, name: user.name, role: user.role };
  }
}
