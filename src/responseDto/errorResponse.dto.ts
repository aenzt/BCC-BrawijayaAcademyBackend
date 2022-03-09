import { ApiProperty } from "@nestjs/swagger";

export  class ErrorResponseDTO  {
    @ApiProperty({default: '400'})
    statusCode: number;
    @ApiProperty()
    message: string;
}