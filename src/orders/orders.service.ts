import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoursesService } from 'src/courses/courses.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private userService: UsersService,

    @Inject(forwardRef(() => CoursesService))
    private courseService: CoursesService,
  ) {}

  async create(order: Order) {
    return this.orderRepository.save(order);
  }

  async update(orderId: string, transactionStatus: string) {
    const order = await this.orderRepository.findOne(orderId);
    if (transactionStatus) {
      order.transcationStatus = transactionStatus;
    }
    if (transactionStatus === 'settlement') {
      const user = await this.userService.findOne(order.userId);
      const course = await this.courseService.findOneOrder(order.courseId);
      user.coursesOwned = [...user.coursesOwned, course];
      await this.userService.update(order.userId, user);
    }
    return this.orderRepository.save(order);
  }

  async findAll(nim: number) {
    const order = await this.orderRepository.find({ userId: nim });
    if (!order || order.length < 1) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    return order;
  }

  async findOne(nim: number, orderId: string) {
    const order = await this.orderRepository.findOne({
      userId: nim,
      orderId: orderId,
    });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    return order;
  }
}
