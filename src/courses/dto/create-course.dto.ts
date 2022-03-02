import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateCourseDto {
    @IsNotEmpty()
    @ApiProperty()
    courseName :string;

    @ApiProperty()
    @IsNotEmpty()
    courseDescription : string;

    @ApiProperty()
    courseBody: string;

    @ApiProperty()
    coursePlaylistLink: string;
}
