import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { Category } from "src/categories/entities/category.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne(() => User, user => user.courseCreated, {onDelete: "SET NULL"})
    author: User

    @ManyToMany(() => User, user => user.coursesOwned)
    user: User[];

    @ManyToMany(() => Category, category => category.courses)
    categories: Category[];

}
