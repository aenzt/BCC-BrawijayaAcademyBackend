import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import * as midtransClient from 'midtrans-client';
import { Order } from 'src/orders/entities/order.entity';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private categoryService: CategoriesService,
    private orderService: OrdersService,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const course = new Course();
    course.name = createCourseDto.name;
    course.description = createCourseDto.description;
    course.body = createCourseDto.body;
    course.playlistLink = createCourseDto.playlistLink;
    course.price = createCourseDto.price;
    const category = await this.categoryService.findOne(
      createCourseDto.categoryId,
    );
    course.categories = [category];
    return this.courseRepository.save(course);
  }

  async findAll() {
    const course = await this.courseRepository.find({
      relations: ['categories'],
    });
    if (course.length < 1) {
      throw new HttpException('No course found', HttpStatus.NOT_FOUND);
    }
    return course;
  }

  async findOne(id: number) {
    const course = await this.courseRepository.findOne(id, {
      relations: ['categories'],
    });
    if (!course) {
      throw new HttpException(
        `Course with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseRepository.findOne(id);
    if (!course) {
      throw new HttpException(
        `Course with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (updateCourseDto.name) {
      course.name = updateCourseDto.name;
    }
    if (updateCourseDto.description) {
      course.description = updateCourseDto.description;
    }
    if (updateCourseDto.body) {
      course.body = updateCourseDto.body;
    }
    if (updateCourseDto.playlistLink) {
      course.playlistLink = updateCourseDto.playlistLink;
    }

    return this.courseRepository.save(course);
  }

  async remove(id: number) {
    const course = await this.courseRepository.findOne(id);
    if (!course) {
      throw new HttpException(
        `Course with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return this.courseRepository.remove(course);
  }

  async buy(id: number) {
    const course = await this.courseRepository.findOne(id);
    if (!course) {
      throw new HttpException(
        `Course with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return this.midtransCharge(course);
  }

  async midtransCharge(course: Course) {
    const core = new midtransClient.CoreApi({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVERKEY,
      clientKey: process.env.MIDTRANS_CLIENTKEY,
    });

    const parameter = {
      payment_type: 'gopay',
      transaction_details: {
        gross_amount: course.price,
        order_id: 'order-' + new Date().getTime(),
      },
      item_details: [
        {
          id: course.id,
          price: course.price,
          quantity: 1,
          name: course.name,
        },
      ],
      customer_details: {
        first_name: 'Budi',
        last_name: 'Utomo',
        email: 'budi.utomo@midtrans.com',
        phone: '081223323423',
      },
    };

    const chargeRes = await core.charge(parameter).catch((e) => {
      throw new HttpException(
        'Midtrans Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
    const order = new Order();
    order.orderId = chargeRes.order_id;
    order.transcationId = chargeRes.transaction_id;
    order.transcationStatus = chargeRes.transaction_status;
    order.orderAt = new Date();
    order.totalPrice = chargeRes.gross_amount;
    this.orderService.create(order);
    return {
      qrCode: chargeRes.actions[0].url,
      deeplinkRedirect: chargeRes.actions[1].url,
    };
  }
}
