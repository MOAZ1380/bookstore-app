import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  /**
   * Add item to user's cart
   */
  async addItem(userId: number, createCartDto: CreateCartDto) {
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { userId, bookId: createCartDto.bookId },
    });

    const book = await this.prisma.book.findUnique({
      where: { id: createCartDto.bookId },
    });
    // Check if book exists
    if (!book) throw new NotFoundException('Book not found');
    // Check if requested quantity exceeds available stock
    if (book.stock < createCartDto.quantity) {
      throw new NotFoundException('Insufficient stock for the requested book');
    }

    if (existingItem) {
      const updated = await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + createCartDto.quantity },
      });
      return { message: 'Cart updated', cartItem: updated };
    }

    const cartItem = await this.prisma.cartItem.create({
      data: { userId, ...createCartDto },
      include: { book: true },
    });

    return { message: 'Item added to cart', cartItem };
  }

  /**
   * Get all items in user's cart
   */
  async findAll(userId: number) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: { book: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Update cart item quantity
   */
  async updateItem(userId: number, id: number, updateCartDto: UpdateCartDto) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: { id, userId },
    });
    if (!cartItem) throw new NotFoundException('Cart item not found');

    const book = await this.prisma.book.findUnique({
      where: { id: cartItem.bookId },
    });
    // Check if book exists
    if (!book) throw new NotFoundException('Book not found');
    // Check if requested quantity exceeds available stock
    if (book.stock < updateCartDto.quantity) {
      throw new NotFoundException('Insufficient stock for the requested book');
    }

    const updated = await this.prisma.cartItem.update({
      where: { id: cartItem.id },
      data: updateCartDto,
      include: { book: true },
    });

    return { message: 'Cart item updated', cartItem: updated };
  }

  /**
   * Remove item from cart
   */
  async removeItem(userId: number, id: number) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: { id, userId },
    });
    if (!cartItem) throw new NotFoundException('Cart item not found');

    await this.prisma.cartItem.delete({ where: { id: cartItem.id } });
    return { message: 'Cart item removed' };
  }

  /**
   * Clear user's cart
   */
  async clearCart(userId: number) {
    await this.prisma.cartItem.deleteMany({ where: { userId } });
    return { message: 'Cart cleared' };
  }
}
