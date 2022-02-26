import { IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class loginUserDto {
  @IsNotEmpty()
  @IsNumber()
  nim: number;

  @IsNotEmpty()
  password: string;
}
