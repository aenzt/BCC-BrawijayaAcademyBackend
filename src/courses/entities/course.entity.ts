import { Category } from "src/categories/entities/category.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({type: 'text', nullable: true})
    body: string;

    @Column({nullable: true})
    playlistLink : string;

    @ManyToMany(() => User, user => user.coursesOwned)
    user: User[];

    @ManyToMany(() => Category, category => category.courses)
    categories: Category[];

}
