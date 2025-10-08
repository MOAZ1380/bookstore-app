import { IsInt, Min, IsOptional } from 'class-validator';

export class UpdateCartDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}
