import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ErrorResponseDTO } from 'src/responseDto/errorResponse.dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
  type: ErrorResponseDTO,
})
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDTO })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all order by logged in user' })
  get(@Req() req) {
    return this.ordersService.findAll(req.user.nim);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one order by logged in user' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getOne(@Param('id') id: string, @Req() req) {
    return this.ordersService.findOne(req.user.nim, id);
  }

  @Post('callback')
  @ApiOperation({ summary: 'For Midtrans Use Only!' })
  update(@Body() order) {
    if (!order.order_id) {
      throw new HttpException('Body not valid', HttpStatus.BAD_REQUEST);
    }
    const orderId = order.order_id;
    const transactionStatus = order.transaction_status;
    return this.ordersService.update(orderId, transactionStatus);
  }
}
