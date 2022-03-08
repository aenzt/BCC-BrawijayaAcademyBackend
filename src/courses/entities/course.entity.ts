import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { Category } from "src/categories/entities/category.entity";
import { User } from "src/users/entities/user.entity";
import { BeforeInsert, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import * as Randomstring from "randomstring";

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column()
    @ApiProperty()
    name: string;

    @Column()
    @ApiProperty()
    description: string;

    @Column({type: 'text', nullable: true})
    @Expose({groups: ['owned']})
    @ApiProperty()
    body: string;

    @Column({nullable: true})
    @Expose({groups: ['owned']})
    @ApiProperty()
    playlistLink : string;

    @Column()
    @ApiProperty()
    price : number;

    @Column({})
    joinCode : string;

    @ManyToMany(() => User, user => user.courseCreated)
    author: User[]

    @ManyToMany(() => User, user => user.coursesOwned)
    user: User[];

    @ManyToMany(() => Category, category => category.courses, {eager: true})
    categories: Category[];

    @BeforeInsert()
    randomCode(){
        this.joinCode = Randomstring.generate(8);
    }

}
