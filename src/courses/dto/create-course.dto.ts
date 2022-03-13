import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl, ValidateIf } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @ValidateIf((o) => o.body)
  @IsNotEmpty()
  body: string;

  @ApiProperty()
  @ValidateIf((o) => o.playlistLink)
  @IsNotEmpty()
  @IsUrl()
  playlistLink: string;

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  imageLink: string;
}
