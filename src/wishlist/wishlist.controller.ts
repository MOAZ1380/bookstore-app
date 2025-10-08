import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtRolesGuard } from 'src/auth/guard/auth.guard';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get('')
  @UseGuards(JwtRolesGuard)
  findAll(@Req() req: any) {
    const userId = req['InfUser'].id;
    return this.wishlistService.findAll(userId);
  }

  @Get(':bookId')
  @UseGuards(JwtRolesGuard)
  findOne(@Param('bookId', ParseIntPipe) bookId: number, @Req() req: any) {
    const userId = req['InfUser'].id;
    return this.wishlistService.findOne(bookId, userId);
  }

  @Delete(':bookId')
  @UseGuards(JwtRolesGuard)
  remove(@Param('bookId', ParseIntPipe) bookId: number, @Req() req: any) {
    const userId = req['InfUser'].id;
    return this.wishlistService.remove(bookId, userId);
  }

  @Post('/:bookId')
  @UseGuards(JwtRolesGuard)
  create(@Param('bookId', ParseIntPipe) bookId: number, @Req() req: any) {
    const userId = req['InfUser'].id;
    return this.wishlistService.create(userId, bookId);
  }
}
