import { Exclude } from "class-transformer";
import { BeforeInsert, Column, Entity, Long, PrimaryColumn } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
    @PrimaryColumn({
        type: 'bigint',
    })
    nim : number;

    @Column()
    @Exclude()
    password : string;

    @Column()
    email : string;

    @Column({})
    fullName : string;

    @Column({})
    faculty : string;

    @Column({})
    major : string;

    //tba
    //course owned
    @BeforeInsert()
    async hashPassword(){
        const salt = await bcrypt.genSaltSync()
        this.password = await bcrypt.hashSync(this.password, salt);
    }

    async validatePassword(password : string) : Promise<boolean>{
        return bcrypt.compare(password, this.password);
    }
}