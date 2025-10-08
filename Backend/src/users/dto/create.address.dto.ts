import { IsString, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  street: string;

  @IsOptional()
  @IsString()
  house_number?: string;

  @IsOptional()
  @IsString()
  floor?: string;
}
