import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUrl, ValidateIf } from "class-validator";

export class CreateCourseDto {
    @ApiProperty()
    @IsNotEmpty()
    name :string;

    @ApiProperty()
    @IsNotEmpty()
    description : string;

    @ApiProperty()
    @ValidateIf(o => o.courseBody)
    @IsNotEmpty()
    body: string;

    @ApiProperty()
    @ValidateIf(o => o.coursePlaylistLink)
    @IsNotEmpty()
    @IsUrl()
    playlistLink: string;

    @ApiProperty()
    @IsNotEmpty()
    price: number;

    @ApiProperty()
    categoryId : number;
}
