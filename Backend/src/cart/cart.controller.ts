import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/utils/decorator/roles.decorator';
import { JwtRolesGuard } from 'src/auth/guard/auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  addItem(@Req() req: any, @Body() dto: CreateCartDto) {
    const userId = req['InfUser'].id;
    return this.cartService.addItem(userId, dto);
  }

  @Get()
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  findAll(@Req() req: any) {
    const userId = req['InfUser'].id;
    return this.cartService.findAll(userId);
  }

  @Patch(':id')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  updateItem(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCartDto,
  ) {
    const userId = req['InfUser'].id;
    return this.cartService.updateItem(userId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  removeItem(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const userId = req['InfUser'].id;
    return this.cartService.removeItem(userId, id);
  }

  @Delete()
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  clearCart(@Req() req: any) {
    const userId = req['InfUser'].id;
    return this.cartService.clearCart(userId);
  }
}
