import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as Randomstring from 'randomstring';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty({ example: 'Course 1', description: 'Course name' })
  name: string;

  @Column()
  @ApiProperty({
    example: 'Course 1 Description',
    description: 'Course Description',
  })
  description: string;

  @Column({ type: 'text', nullable: true })
  @Expose({ groups: ['owned'] })
  @ApiProperty({ nullable: true, description: 'Course Body' })
  body: string;

  @Column({ nullable: true })
  @Expose({ groups: ['owned'] })
  @ApiProperty({
    nullable: true,
    description: 'Course Playlist Link',
    example: 'https://www.youtube.com/playlist?v=dQw4w9WgXcQ',
  })
  playlistLink: string;

  @Column()
  @ApiProperty()
  price: number;

  @Column({})
  @Exclude()
  joinCode: string;

  @ManyToMany(() => User, (user) => user.courseCreated)
  author: User[];

  @ManyToMany(() => User, (user) => user.coursesOwned)
  user: User[];

  @ManyToMany(() => Category, (category) => category.courses, { eager: true })
  categories: Category[];

  @BeforeInsert()
  randomCode() {
    this.joinCode = Randomstring.generate(8);
  }
}
