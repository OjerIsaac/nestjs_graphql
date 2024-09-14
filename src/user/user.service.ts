import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(email: string, password: string): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: { email, password: hashedPassword },
    });
  }

  async login(email: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async biometricLogin(biometricKey: string): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({ where: { biometricKey } });

    if (!user) {
      throw new UnauthorizedException('Invalid biometric key');
    }

    const payload = { userId: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async setBiometricKey(userId: number, biometricKey: string): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({ where: { biometricKey } });

    if (existingUser) {
      throw new ConflictException('Biometric key is already in use');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { biometricKey },
    });
  }
}
