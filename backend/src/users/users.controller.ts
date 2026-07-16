import { BadRequestException, Body, ConflictException, Controller, Get, Post } from '@nestjs/common';
import { DataService } from '../data/data.service';
import { User } from '../data/types';

interface CreateUserDto {
  email?: string;
  password?: string;
  name?: string;
  role?: string;
}

// Admin-managed accounts. The admin console creates Field Technician and
// Client users here; admins themselves are seeded (no self-service signup).
// NOTE (prototype): passwords are stored in plaintext to match the seeded
// accounts — hash with bcrypt before real production use.
@Controller('users')
export class UsersController {
  constructor(private readonly data: DataService) {}

  @Get()
  list(): Promise<Omit<User, 'password'>[]> {
    return this.data.listUsers();
  }

  @Post()
  async create(@Body() body: CreateUserDto): Promise<Omit<User, 'password'>> {
    const name = (body?.name ?? '').trim();
    const email = (body?.email ?? '').trim();
    const password = body?.password ?? '';
    const role = body?.role;

    if (!name) throw new BadRequestException('name is required');
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new BadRequestException('a valid email is required');
    if (password.length < 6) throw new BadRequestException('password must be at least 6 characters');
    if (role !== 'tech' && role !== 'client') {
      throw new BadRequestException('role must be "tech" (Field Technician) or "client"');
    }
    if (await this.data.emailTaken(email)) {
      throw new ConflictException('An account with this email already exists');
    }

    return this.data.addUser({ email, password, name, role });
  }
}
