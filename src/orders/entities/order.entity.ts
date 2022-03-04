import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Order{
    @PrimaryColumn()
    orderId: string;

    @Column()
    courseId: number;

    @Column({
        type: 'bigint',
    })
    userId: number;

    @Column()
    transcationId: string;

    @Column()
    transcationStatus: string;

    @Column()
    totalPrice: number;

    @Column()
    orderAt: Date;
}