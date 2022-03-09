import { ApiProperty } from "@nestjs/swagger";

export class BaseResponseDTO{
    @ApiProperty({default: '200'})
    statusCode: number;
    @ApiProperty()
    message: string;
    @ApiProperty()
    data: {};
}