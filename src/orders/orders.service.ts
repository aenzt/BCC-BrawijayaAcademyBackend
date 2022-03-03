import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(order: Order) {
    return this.orderRepository.save(order);
  }

  async update(orderId : string, transactionStatus : string) {
    const order = await this.orderRepository.findOne(orderId);
    if(transactionStatus){
        order.transcationStatus = transactionStatus;
    }
    return this.orderRepository.save(order);
  }
}
