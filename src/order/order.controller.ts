import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RolesEnum } from 'src/enums/roles.enum';
import { Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { OrderCreateDto } from './dto/order.create.dto';
import { OrderUpdateDto } from './dto/order.update.dto';

@Controller('order')
@ApiTags('Order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @Roles(RolesEnum.User)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  createOrder(@Body() body: OrderCreateDto, @Req() req: any) {
    return this.orderService.createOrder(body, req.user);
  }

  @Get(':id')
  @Roles(RolesEnum.User, RolesEnum.Merchant, RolesEnum.Courier)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiQuery({ name: 'id', required: false })
  getOrders(@Req() req: any, @Query('id') id?: number) {
    return this.orderService.getOrders(req.user, id);
  }

  @Put(':id')
  @Roles(RolesEnum.Merchant)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  updateOrder(
    @Body() body: OrderUpdateDto,
    @Param('id') id: number,
    @Req() req,
  ) {
    return this.orderService.updateOrderStatus(req.user, id, body);
  }
}
