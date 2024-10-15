import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemCreateDto } from './dto/item.create.dto';
import { AuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesEnum } from 'src/enums/roles.enum';
import { ItemResponseDto } from './dto/item.response.dto';

@Controller('item')
@ApiTags('Item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get()
  @ApiQuery({ name: 'merchantId', required: false })
  @ApiQuery({ name: 'id', required: false })
  getItems(
    @Query('id') id?: number,
    @Query('merchantId') merchantId?: number,
  ): Promise<ItemResponseDto[]> {
    return this.itemService.getItems(id, merchantId);
  }

  @Post()
  @Roles(RolesEnum.Merchant)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  createItem(@Body() body: ItemCreateDto, @Req() req: any) {
    return this.itemService.createItem(body, req.user);
  }

  @Put(':id')
  @Roles(RolesEnum.Merchant)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  updateItem(
    @Body() body: ItemCreateDto,
    @Param('id') id: number,
  ): Promise<ItemResponseDto> {
    return this.itemService.updateItem(body, id);
  }

  @Delete(':id')
  @Roles(RolesEnum.Merchant)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  deleteItem(@Param('id') id: number) {
    return this.itemService.deleteItem(id);
  }
}
