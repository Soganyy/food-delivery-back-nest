import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { OrderCreateDto } from './dto/order.create.dto';
import { OrderStatus } from 'src/enums/order-status.enum';
import { MerchantService } from 'src/merchant/merchant.service';
import { ItemService } from 'src/item/item.service';
import { OrderItem } from 'src/order-item/order-item.entity';
import { UserService } from 'src/user/user.service';
import { RolesEnum } from 'src/enums/roles.enum';
import { plainToInstance } from 'class-transformer';
import { OrderResponseDto } from './dto/order.response.dto';
import { OrderUpdateDto } from './dto/order.update.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private merchantService: MerchantService,
    private itemsService: ItemService,
    private userService: UserService,
  ) {}

  async createOrder(body: OrderCreateDto, userCredentials) {
    try {
      const { merchantId, items, deliveryPrice, deliveryTime } = body;

      const merchant = await this.merchantService.getMerchantById(merchantId);
      const user = await this.userService.getUserById(userCredentials.id);

      const newOrder = this.orderRepository.create({
        status: OrderStatus.PendingMerchantResponse,
        orderItems: [],
        merchant: merchant,
        deliveryPrice: deliveryPrice,
        deliveryTime: deliveryTime,
        user: user,
      });

      let totalPrice = 0;

      for (const item of items) {
        const foundItem = await this.itemsService.getItemById(item.itemId);

        if (!foundItem) {
          throw new Error(`Item with ID ${item.itemId} not found`);
        }

        const orderItem = new OrderItem();
        orderItem.item = foundItem;
        orderItem.quantity = item.quantity;
        orderItem.price = foundItem.price * item.quantity;
        totalPrice += orderItem.price;

        newOrder.orderItems.push(orderItem);
      }

      await this.orderRepository.save(newOrder);

      return HttpStatus.CREATED;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getOrders(user, id?: number) {
    let where: any = {};

    if (user.role === RolesEnum.Merchant) {
      where.merchant = { id: user.id };
    } else if (user.role === RolesEnum.User) {
      where.user = { id: user.id };
    } else if (user.role === RolesEnum.Courier) {
      where.courier = { id: user.id };
    }

    if (id) {
      where.id = id;
    }

    const orders = await this.orderRepository.find({
      where,
      relations: ['merchant', 'user', 'couriers'],
    });

    return orders.map((order) =>
      plainToInstance(OrderResponseDto, {
        id: order.id,
        totalPrice: order.totalPrice,
        deliveryTime: order.deliveryTime,
        deliveryPrice: order.deliveryPrice,
        status: order.status,
        merchant: {
          id: order.merchant.id,
          businessName: order.merchant.businessName,
          address: order.merchant.address,
          phoneNumber: order.merchant.phoneNumber,
        },
        user: {
          id: order.user.id,
          firstName: order.user.firstName,
          address: order.user.address,
          phoneNumber: order.user.phoneNumber,
        },
        courier: {},
      }),
    );
  }

  async updateOrderStatus(user, id: number, body: OrderUpdateDto) {
    const orderExist = await this.orderRepository.findOne({
      where: { id: id },
      relations: ['merchant'],
    });

    if (!orderExist)
      throw new NotFoundException(
        'Order not found, there is a problem on id of order',
      );

    if (orderExist.merchant.id !== user.id)
      throw new HttpException(
        "You don't have permission to edit this order",
        HttpStatus.FORBIDDEN,
      );

    try {
      const updatedOrder = { ...orderExist, status: body.status };
      console.log(updatedOrder);

      const savedOrder = await this.orderRepository.save(updatedOrder);

      return savedOrder;
    } catch (error) {
      throw new error.message();
    }
  }
}
