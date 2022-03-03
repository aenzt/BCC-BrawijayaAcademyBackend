import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  update(@Body() order) {
    const orderId = order.order_id;
    const transactionStatus = order.transaction_status;
    return this.ordersService.update(orderId, transactionStatus);
  }
}
