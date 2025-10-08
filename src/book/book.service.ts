import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Express } from 'express';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new book
   * @param createBookDto - Book info
   * @param file - Cover image file
   */
  async create(createBookDto: CreateBookDto, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Cover image is required');
    }

    const { categoryId, ...bookData } = createBookDto;

    console.log(file);

    const existingCategory = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    const newBook = await this.prisma.book.create({
      data: {
        ...bookData,
        coverImage: file?.filename || '',
        category: { connect: { id: categoryId } },
      },
    });

    return { message: 'Book created successfully', book: newBook };
  }

  /**
   * Get all books
   */
  async findAll() {
    return this.prisma.book.findMany();
  }

  /**
   * Get single book by id
   * @param id Book ID
   */
  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  /**
   *
   * @param id Book ID
   * @param updateBookDto
   * @param file
   * @returns
   */
  async update(
    id: number,
    updateBookDto: UpdateBookDto,
    file?: Express.Multer.File,
  ) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');

    const { categoryId, ...bookData } = updateBookDto;

    if (file && book.coverImage) {
      const oldImagePath = join(
        process.cwd(),
        'uploads',
        'books',
        book.coverImage,
      );
      if (existsSync(oldImagePath)) {
        unlinkSync(oldImagePath);
      }
    }

    const dataToUpdate: any = {
      ...bookData,
      ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
      ...(file ? { coverImage: file.filename } : {}),
    };

    const updatedBook = await this.prisma.book.update({
      where: { id },
      data: dataToUpdate,
    });

    return { message: 'Book updated successfully', book: updatedBook };
  }

  /**
   * Delete book by id
   * @param id Book ID
   */
  async remove(id: number) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');

    if (book.coverImage) {
      const imagePath = join(
        process.cwd(),
        'uploads',
        'books',
        book.coverImage,
      );
      if (existsSync(imagePath)) {
        unlinkSync(imagePath);
      }
    }

    await this.prisma.book.delete({ where: { id } });
    return { message: 'Book deleted successfully' };
  }

  /**
   * Get all books under a specific category
   * @param categoryId Category ID
   */
  async findBooksByCategory(categoryId: number) {
    const books = await this.prisma.book.findMany({
      where: { categoryId },
    });

    if (!books.length)
      throw new NotFoundException('No books found in this category');
    return books;
  }
}
