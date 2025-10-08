import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Create a new category
   * @param createCategoryDto - DTO containing category data
   * @returns the created category
   */
  async create(createCategoryDto: CreateCategoryDto) {
    // Check if category with the same name already exists
    const existingCategory = await this.prismaService.category.findFirst({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new BadRequestException('Category with this name already exists');
    }

    const category = await this.prismaService.category.create({
      data: createCategoryDto,
    });

    return { message: 'Category created successfully', category };
  }

  /**
   * Get all categories
   * @returns an array of categories
   */
  async findAll() {
    return await this.prismaService.category.findMany();
  }

  /**
   * Get a single category by id
   * @param id - category id
   * @returns the category
   */
  async findOne(id: number) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
      include: { books: true },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  /**
   * Update a category by id
   * @param id - category id
   * @param updateCategoryDto - DTO containing updated fields
   * @returns the updated category
   */
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    const category = await this.prismaService.category.update({
      where: { id },
      data: updateCategoryDto,
    });

    return { message: 'Category updated successfully', category };
  }

  /**
   * Delete a category by id
   * @param id - category id
   * @returns a success message
   */
  async remove(id: number) {
    const existingCategory = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    await this.prismaService.category.delete({
      where: { id },
    });

    return { message: 'Category deleted successfully' };
  }
}
