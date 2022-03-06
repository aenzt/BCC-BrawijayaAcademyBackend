import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('callback')
  update(@Body() order) {
    if(!order.order_id){
        throw new HttpException("Body not valid", HttpStatus.BAD_REQUEST);
    }
    const orderId = order.order_id;
    const transactionStatus = order.transaction_status;
    return this.ordersService.update(orderId, transactionStatus);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  get(@Req() req) {
    return this.ordersService.findAll(req.user.nim);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  getOne(@Param('id') id: string, @Req() req) {
    return this.ordersService.findOne(req.user.nim, id);
  }
}
