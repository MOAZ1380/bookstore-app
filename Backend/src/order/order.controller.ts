import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderStatus, UserRole } from '@prisma/client';
import { Roles } from 'src/utils/decorator/roles.decorator';
import { JwtRolesGuard } from 'src/auth/guard/auth.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  createOrder(@Req() req: Request) {
    const userId = req['InfUser'].id;
    return this.orderService.createOrderFromCart(userId);
  }

  @Get('')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.orderService.findAll();
  }

  @Get('me')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  findMyOrders(@Req() req: Request) {
    const userId = req['InfUser'].id;
    return this.orderService.findMyOrders(userId);
  }

  @Get('/:id')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = req['InfUser'].id;
    return this.orderService.findOne(userId, id);
  }

  @Patch('/:id')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  updateStatus(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = req['InfUser'].id;
    return this.orderService.updateStatus(userId, id, OrderStatus.CANCELLED);
  }

  @Get('user/:userId')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN)
  findAllOrdersByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.orderService.findAllOrdersByUser(userId);
  }

  @Patch(':id/status')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN)
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: OrderStatus,
  ) {
    return this.orderService.updateOrderStatusByAdmin(id, status);
  }
}
