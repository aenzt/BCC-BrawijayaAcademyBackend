import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { UsersModule } from 'src/users/users.module';
import { CoursesService } from 'src/courses/courses.service';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), UsersModule, forwardRef(() => CoursesModule)],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService, TypeOrmModule],
})
export class OrdersModule {}
