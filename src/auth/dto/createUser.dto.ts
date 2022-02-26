import { IsEmail, IsNotEmpty, IsNumber, Min, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNumber()
    @IsNotEmpty()
    nim: number;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}