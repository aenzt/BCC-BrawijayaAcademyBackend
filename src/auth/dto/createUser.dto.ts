import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, Min, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    nim: number;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({enum: ['user', 'instructor', 'admin']})
    role?: string;
}