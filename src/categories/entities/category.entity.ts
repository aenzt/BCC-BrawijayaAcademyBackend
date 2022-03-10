import { ApiProperty } from "@nestjs/swagger";
import { Course } from "src/courses/entities/course.entity";
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @ApiProperty()
    @Column({unique: true})
    name: string;

    @ManyToMany(() => Course, course => course.categories)
    @JoinTable()
    courses : Course[];

    @BeforeInsert()
    toUpperCase(){
        this.name = this.name.toUpperCase();
    }
}
