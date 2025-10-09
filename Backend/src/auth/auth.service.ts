import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Sign in a user with email and password
   * @param loginAuthDto - The login data containing email and password
   * @return An object containing the JWT token
   */
  async signIn(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser || !existingUser.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('password or email is incorrect');
    }

    const payload = { userId: existingUser.id, email: existingUser.email };
    const token = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { token };
  }

  /**
   * Sign up a new user with email and password
   * @param createAuthDto - The sign-up data containing email and password
   * @return An object containing the created user and JWT token
   */
  async signUp(createAuthDto: CreateAuthDto) {
    const { email, password } = createAuthDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('This user already exists, please login');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        ...createAuthDto,
        password: hashedPassword,
      },
    });

    const payload = { userId: newUser.id, email: newUser.email };
    const token = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { user: newUser, token };
  }
}
