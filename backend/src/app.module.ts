import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [UsersModule, PrismaModule, CategoryModule, AuthModule, BookModule, WishlistModule, CartModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
