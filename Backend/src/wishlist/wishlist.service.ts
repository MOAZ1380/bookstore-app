import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  /**
   * Add book to user's wishlist
   * @param createWishlistDto Book ID
   * @param userId Logged-in user's ID
   */
  async create(userId: number, bookId: number) {
    try {
      const existingbook = await this.prisma.book.findUnique({
        where: { id: bookId },
      });
      if (!existingbook) {
        throw new NotFoundException('Book not found');
      }

      const existingItem = await this.prisma.wishlist.findUnique({
        where: { userId_bookId: { userId, bookId } },
      });
      if (existingItem) {
        throw new ConflictException('This book is already in the wishlist');
      }

      const wishlistItem = await this.prisma.wishlist.create({
        data: { userId, bookId },
        include: { book: true },
      });
      return { message: 'Book added to wishlist', wishlistItem };
    } catch (error) {
      throw new ConflictException('This book is already in the wishlist');
    }
  }

  /**
   * Get all wishlist items for logged-in user
   */
  async findAll(userId: number) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      include: { book: true },
    });
  }

  /**
   * Get wishlist item by id (for this user)
   */
  async findOne(bookId: number, userId: number) {
    const item = await this.prisma.wishlist.findUnique({
      where: { userId_bookId: { userId, bookId } },
      include: { book: true },
    });
    if (!item) throw new NotFoundException('Wishlist item not found');
    return item;
  }

  /**
   * Remove book from wishlist (only for this user)
   */
  async remove(bookId: number, userId: number) {
    const item = await this.prisma.wishlist.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });
    if (!item) throw new NotFoundException('Wishlist item not found');

    await this.prisma.wishlist.delete({ where: { id: item.id } });
    return { message: 'Book removed from wishlist' };
  }
}
