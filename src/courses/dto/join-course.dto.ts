import { ApiProperty } from "@nestjs/swagger";

export class JoinCourseDto {

    @ApiProperty()
    joinCode: string;
}