import { IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class loginUserDto {
  nim: number;

  email: string;

  @IsNotEmpty()
  password: string;
}
