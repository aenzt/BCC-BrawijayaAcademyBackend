import { PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./createUser.dto";

export class updateUserDto extends PartialType(CreateUserDto) {}