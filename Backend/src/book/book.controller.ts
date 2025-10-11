import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMulterOptions } from 'src/utils/uploads/uploadSingleImage';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/utils/decorator/roles.decorator';
import { JwtRolesGuard } from 'src/auth/guard/auth.guard';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('coverImage', createMulterOptions('books')))
  create(
    @Body() createBookDto: CreateBookDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.bookService.create(createBookDto, file);
  }

  @Get()
  findAll(@Pagination() pagination) {
    const { limit, offset } = pagination;
    return this.bookService.findAll(limit, offset);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('coverImage', createMulterOptions('books')))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.bookService.update(id, updateBookDto, file);
  }

  @Delete(':id')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.remove(id);
  }

  @Get('category/:categoryId')
  getBooksByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.bookService.findBooksByCategory(categoryId);
  }

  @Patch('discount/')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN)
  updateAllBooksDiscount(@Body('discount') discount: number) {
    return this.bookService.updateAllBooksDiscount(discount);
  }

  @Patch('discount/:id')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN)
  updateBookDiscount(
    @Param('id', ParseIntPipe) id: number,
    @Body('discount') discount: number,
  ) {
    return this.bookService.updateBookDiscount(id, discount);
  }

  @Patch('clear-discount/')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN)
  clearAllBooksDiscount() {
    return this.bookService.clearAllBooksDiscount();
  }

  @Patch('clear-discount/:id')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN)
  clearBookDiscount(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.clearBookDiscount(id);
  }
}
