import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class loginUserDto {
  @ApiPropertyOptional({})
  @IsNumber()
  nim: number;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
