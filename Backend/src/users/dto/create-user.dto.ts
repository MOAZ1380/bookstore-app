import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
  Max,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Address, UserRole } from '@prisma/client';
import { CreateAddressDto } from './create.address.dto';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @MinLength(2, {
    message: 'Name is too short. Minimum length is $constraint1 characters.',
  })
  @MaxLength(50, {
    message: 'Name is too long. Maximum length is $constraint1 characters.',
  })
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, {
    message:
      'Password is too short. Minimum length is $constraint1 characters.',
  })
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
