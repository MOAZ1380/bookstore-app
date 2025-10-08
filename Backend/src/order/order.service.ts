import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new order for a user based on their cart items.
   * Steps:
   * 1. Fetch all cart items for the user.
   * 2. Calculate total price.
   * 3. Create the order and related order items.
   * 4. Clear the user's cart after order creation.
   *
   * @param userId - The ID of the user who is creating the order.
   * @returns A message and the created order object.
   * @throws NotFoundException if the user's cart is empty.
   */
  async createOrderFromCart(userId: number) {

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const userAddress = await this.prisma.address.findFirst({ where: { userId: userId } });

    // Check if user and address exist
    if (!user) throw new NotFoundException('User not found');
    // Check if user phone and address exist
    if (!user.phone || !userAddress) {
      throw new NotFoundException('User profile incomplete. Please update phone and address.');
    }
    // Fetch all cart items for the user
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { book: true },
    });

    if (cartItems.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    // Calculate total order price
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.book.price.toNumber() * item.quantity,
      0,
    );

    // Create the order and its related order items
    const order = await this.prisma.order.create({
      data: {
        userId,
        status: OrderStatus.PENDING,
        totalPrice,
        orderItems: {
          create: cartItems.map((item) => ({
            bookId: item.bookId,
            quantity: item.quantity,
            price: item.book.price,
          })),
        },
      },
      include: { orderItems: true },
    });

    // remove stock from books
    for (const item of cartItems) {
      await this.prisma.book.update({
        where: { id: item.bookId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Clear the user's cart after order creation
    await this.prisma.cartItem.deleteMany({ where: { userId } });

    return { message: 'Order created successfully', order };
  }

  /**
   * Retrieve all orders for a specific user.
   *
   * @param userId - The ID of the user.
   * @returns A list of orders with their items and related books.
   */
  async findMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { orderItems: { include: { book: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieve a single order by its ID for a specific user.
   *
   * @param userId - The ID of the user.
   * @param id - The ID of the order.
   * @returns The order with its items and related books.
   * @throws NotFoundException if the order does not exist.
   */
  async findOne(userId: number, id: number) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: { orderItems: { include: { book: true } } },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  /**
   * Update the status of an existing order.
   *
   * @param id - The ID of the order.
   * @param status - The new status (PENDING, PROCESSING, COMPLETED, CANCELLED).
   * @returns The updated order.
   * @throws NotFoundException if the order does not exist.
   */
  async updateStatus(userId: number, id: number, status: OrderStatus) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
    });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Delete an order by its ID.
   *
   * @param id - The ID of the order to delete.
   * @returns A confirmation message.
   * @throws NotFoundException if the order does not exist.
   */
  async remove(id: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    // add quantity back to book stock
    const orderItems = await this.prisma.orderItem.findMany({
      where: { orderId: id },
    });

    // add stock back to books
    for (const item of orderItems) {
      await this.prisma.book.update({
        where: { id: item.bookId },
        data: { stock: { increment: item.quantity } },
      });
    }

    await this.prisma.order.delete({ where: { id } });
    return { message: 'Order removed successfully' };
  }



  
  /**
   * [ADMIN ONLY]
   * Fetch all orders placed by a specific user.
   *
   * @param userId - The ID of the user whose orders are being fetched.
   * @returns An array of orders including their items and related books.
   */
  async findAllOrdersByUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: { include: { book: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (orders.length === 0)
      throw new NotFoundException('No orders found for this user');

    return orders;
  }


  /**
   * [ADMIN ONLY]
   * Update the status of an order by its ID.
   *
   * @param id - The ID of the order to update.
   * @param status - The new status to assign (PENDING, PROCESSING, COMPLETED, CANCELLED).
   * @returns The updated order.
   * @throws NotFoundException if the order does not exist.
   */
  async updateOrderStatusByAdmin(id: number, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });

    if (!order) throw new NotFoundException('Order not found');

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: { orderItems: { include: { book: true } } },
    });

    return {
      message: `Order #${id} status updated to ${status}`,
      updatedOrder,
    };
  }



  /**
   * [ADMIN ONLY]
   * Retrieve all orders in the system.
   * @returns An array of all orders with their items and related books.
  */
  async findAll() {
    return this.prisma.order.findMany({
      include: { orderItems: { include: { book: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
  
}
