import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Order{
    @PrimaryColumn()
    orderId: string;

    @Column()
    transcationId: string;

    @Column()
    transcationStatus: string;

    @Column()
    orderAt: Date;

    @Column()
    totalPrice: number;
}