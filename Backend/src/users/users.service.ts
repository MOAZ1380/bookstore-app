import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { UpdateUserByAdminDto } from './dto/update-user-by-admin.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new user (Admin or self-registration)
   * - Hashes password
   * - Creates related address if provided
   * @param createUserDto - User creation DTO
   * @returns newly created user without password
   */
  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const { address, ...userData } = createUserDto;

    const newUser = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        ...(address && {
          address: {
            create: { ...address },
          },
        }),
      },
      include: { address: true },
    });

    return {
      message: 'User created successfully',
      user: this.removePassword(newUser),
    };
  }

  /**
   * Get all users
   * - Includes related address
   * - Removes password field from results
   * @returns array of users
   */
  async findAll() {
    const users = await this.prisma.user.findMany({
      include: { address: true },
    });
    if (!users.length) throw new NotFoundException('No users found');
    return users.map((u) => this.removePassword(u));
  }

  /**
   * Get single user by ID
   * - Includes related address
   * - Removes password
   * @param id - User ID
   */
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { address: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return this.removePassword(user);
  }

  /**
   * Update any user (admin use)
   * - Checks for duplicate email
   * - Upserts address if provided
   * @param id - User ID
   * @param updateUserDto - DTO with fields to update
   */
  async updateUser(id: number, updateUserDto: UpdateUserByAdminDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { address: true },
    });
    if (!user) throw new NotFoundException('User not found');

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (existingUser)
        throw new BadRequestException('User with this email already exists');
    }

    const { address, ...userData } = updateUserDto;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...userData,
        ...(address && {
          address: { upsert: { create: address, update: address } },
        }),
      },
      include: { address: true },
    });

    return {
      message: 'User updated successfully',
      user: this.removePassword(updatedUser),
    };
  }

  /**
   * Delete a user (hard delete)
   * @param id - User ID
   */
  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }

  /**
   * Get currently logged-in user
   * - Extracted from request['InfUser']
   * - Includes related address
   */
  async getLoggedUserData(request: any) {
    const user = request['InfUser'] as User;
    const freshUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { address: true },
    });
    if (!freshUser) throw new UnauthorizedException('User not found in DB');
    return this.removePassword(freshUser);
  }

  /**
   * Update password for logged-in user
   * - Validates new password
   * - Checks if new password is same as old
   * - Updates password and sets passwordChangeAt
   */
  async updateLoggedUserPassword(request: any) {
    const user = request['InfUser'] as User;
    if (!user) throw new UnauthorizedException('User not found in request');

    const newPassword = request.body?.newPassword;
    if (!newPassword) throw new BadRequestException('New password is required');
    if (newPassword.length < 6)
      throw new BadRequestException(
        'Password must be at least 6 characters long',
      );

    const existingUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });
    const isSamePassword = await bcrypt.compare(
      newPassword,
      existingUser.password,
    );
    if (isSamePassword)
      throw new BadRequestException(
        'New password cannot be the same as the old password',
      );

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, passwordChangeAt: new Date() },
    });

    return { message: 'Password updated successfully, please login again' };
  }

  /**
   * Update profile data for logged-in user
   * - Checks for duplicate email
   * - Upserts address if provided
   */
  async updateLoggedUserData(updateUserDto: UpdateUserDto, request: any) {
    const user = request['InfUser'] as User;
    if (!user) throw new UnauthorizedException('User not found in request');

    const existingUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });
    if (!existingUser) throw new UnauthorizedException('User not found in DB');

    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (emailExists) throw new ConflictException('Email already exists');
    }

    const { address, ...userData } = updateUserDto;

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        ...userData,
        ...(address && {
          address: { upsert: { create: address, update: address } },
        }),
      },
      include: { address: true },
    });

    return {
      message: 'User data updated successfully',
      user: this.removePassword(updatedUser),
    };
  }

  /**
   * Soft delete (deactivate) logged-in user
   * - Sets isActive=false
   */
  async deleteLoggedUserAccount(request: any) {
    const user = request['InfUser'] as User;
    if (!user) throw new UnauthorizedException('User not found in request');

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { isActive: false },
    });

    return {
      message: 'User account deactivated successfully',
      user: this.removePassword(updatedUser),
    };
  }

  /**
   * Helper method: remove password field from user object
   */
  private removePassword(user: any) {
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
  }
}
