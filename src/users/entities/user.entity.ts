import { Exclude } from "class-transformer";
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { ApiProperty } from "@nestjs/swagger";
import { Course } from "src/courses/entities/course.entity";

@Entity()
export class User {
    @PrimaryColumn({
        type: 'bigint',
    })
    @ApiProperty()
    nim : number;

    @Column()
    @Exclude()
    password : string;

    @Column()
    @ApiProperty()
    email : string;

    @Column({})
    @ApiProperty()
    fullName : string;

    @Column({})
    @ApiProperty()
    faculty : string;

    @Column({})
    @ApiProperty()
    major : string;

    //tba
    //course owned
    // @ApiProperty()
    @ManyToMany(() => Course, course => course.user)
    @JoinTable()
    coursesOwned : Course[];

    @BeforeInsert()
    async hashPassword(){
        const salt = await bcrypt.genSaltSync()
        this.password = await bcrypt.hashSync(this.password, salt);
    }

    async validatePassword(password : string) : Promise<boolean>{
        return bcrypt.compare(password, this.password);
    }
}