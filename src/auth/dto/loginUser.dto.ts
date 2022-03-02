import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  Min,
  minLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class loginUserDto {
  @ApiPropertyOptional({})
  @IsNumber()
  nim: number;

  //   @ApiPropertyOptional()
  //   @ValidateIf(o => o.email)
  //   @IsNotEmpty()
  //   @IsEmail()
  //   email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
