import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockPrismaService = () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
});

const mockJwtService = () => ({
  sign: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useFactory: mockPrismaService },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedPassword123';

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as any);
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.user, 'create').mockResolvedValue({
        id: 1,
        email,
        password: hashedPassword,
        biometricKey: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const user = await service.register(email, password);

      expect(user).toEqual({
        id: 1,
        email,
        password: hashedPassword,
        biometricKey: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { email, password: hashedPassword },
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({ id: 1, email } as any);

      await expect(service.register(email, password)).rejects.toThrow(ConflictException);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
    });
  });

  describe('login', () => {
    it('should return an access token on successful login', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedPassword123';
      const accessToken = 'accessToken123';

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        id: 1,
        email,
        password: hashedPassword,
        biometricKey: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
      jest.spyOn(jwtService, 'sign').mockReturnValue(accessToken);

      const result = await service.login(email, password);

      expect(result).toEqual({ accessToken });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(jwtService.sign).toHaveBeenCalledWith({ userId: 1, email });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        id: 1,
        email,
        password: 'hashedPassword123',
        biometricKey: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      await expect(service.login(email, password)).rejects.toThrow(UnauthorizedException);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, 'hashedPassword123');
    });
  });
});
