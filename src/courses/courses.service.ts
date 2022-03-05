import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import * as midtransClient from 'midtrans-client';
import { Order } from 'src/orders/entities/order.entity';
import { OrdersService } from 'src/orders/orders.service';
import { UsersService } from 'src/users/users.service';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private categoryService: CategoriesService,
    private userService: UsersService,

    @Inject(forwardRef(() => OrdersService))
    private orderService: OrdersService,
  ) {}

  async create(createCourseDto: CreateCourseDto, nim: string) {
    const course = new Course();
    const author = await this.userService.findOne(+nim);
    course.name = createCourseDto.name;
    course.description = createCourseDto.description;
    course.body = createCourseDto.body;
    course.playlistLink = createCourseDto.playlistLink;
    course.price = createCourseDto.price;
    course.author = author;
    const category = await this.categoryService.findOne(
      createCourseDto.categoryId,
    );
    course.categories = [category];
    const created = await this.courseRepository.save(course);
    return {
      message: 'Create course success',
      data: created,
    };
  }

  async findAll() {
    const course = await this.courseRepository.find({
      relations: ['categories', 'author'],
    });
    if (course.length < 1) {
      throw new HttpException('No course found', HttpStatus.NOT_FOUND);
    }
    return {
      message: 'Get all course success',
      data: {
        course,
      },
    };
  }

  async findOne(id: number, nim?: string) {
    const course = await this.courseRepository.findOne(id, {
      relations: ['categories', 'author'],
    });
    if (!course) {
      throw new HttpException(
        `Course with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (nim) {
      const user = await this.userService.findOne(+nim);
      if (await this.userService.checkCourse(user, course)) {
        const courseOwned = instanceToPlain(course, { groups: ['owned'] });
        return {
          data: courseOwned,
          message: 'Get course success',
        };
      }
    }
    return {
      data: course,
      message: 'Get course success',
    };
  }

  async findOneOrder(id: number) {
    const course = await this.courseRepository.findOne(id, {
      relations: ['categories', 'author'],
    });
    if (!course) {
      throw new HttpException(
        `Course with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto, nim: string) {
    const course = await this.courseRepository.findOne(id);
    if (!course) {
      throw new HttpException(
        `Course with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    if(course.author.nim !== +nim){
        throw new HttpException(
            `You are not the author of this course`,
            HttpStatus.BAD_REQUEST,
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

  async remove(id: number, nim: string) {
    const course = await this.courseRepository.findOne(id);
    if (!course) {
      throw new HttpException(
        `Course with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    if(course.author.nim !== +nim){
        throw new HttpException(
            `You are not the author of this course`,
            HttpStatus.BAD_REQUEST,
            );
    }
    const removed = await this.courseRepository.remove(course);
    return {
      message: 'Delete course success',
      data: removed,
    };
  }

  async buy(id: number, nim: string) {
    const course = await this.courseRepository.findOne(id);
    const user = await this.userService.findOne(+nim);
    if (!course) {
      throw new HttpException(
        `Course with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const owned = await this.userService.checkCourse(user, course);
    if (owned) {
      throw new HttpException(
        `You already own this course`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.midtransCharge(course, user);
  }

  async midtransCharge(course: Course, user: User) {
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
        first_name: user.fullName,
        email: user.email,
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
    order.courseId = course.id;
    order.userId = user.nim;
    order.totalPrice = chargeRes.gross_amount;

    await this.orderService.create(order);

    return {
      data: {
        qrCode: chargeRes.actions[0].url,
        deeplinkRedirect: chargeRes.actions[1].url,
      },
      message: 'Issued QR Code Succcess',
    };
  }
}