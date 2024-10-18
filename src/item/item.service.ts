import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { ItemCreateDto } from './dto/item.create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchantService } from 'src/merchant/merchant.service';
import { ItemResponseDto } from './dto/item.response.dto';
import { plainToInstance } from 'class-transformer';
import { Specification } from 'src/specification/specification.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemEntity: Repository<Item>,
    private merchantService: MerchantService,
    @InjectRepository(Specification)
    private specificationEntity: Repository<Specification>,
  ) {}

  async getItemById(id: number) {
    const item = await this.itemEntity.findOne({
      where: { id: id },
      relations: ['merchant'],
    });

    return item;
  }

  async getItems(id?: number, merchantId?: number): Promise<ItemResponseDto[]> {
    let where: any = {};

    if (merchantId) {
      where.merchant = { id: merchantId };
    }

    if (id) {
      where.id = id;
    }

    const items = await this.itemEntity.find({
      where,
      relations: ['merchant', 'specifications'],
    });

    return items.map((item) =>
      plainToInstance(ItemResponseDto, {
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        merchantId: item.merchant.id,
        specification: item.specifications,
      }),
    );
  }

  async createItem(body: ItemCreateDto, user: any) {
    try {
      const merchant = await this.merchantService.findOne({
        email: user.email,
        password: user.password,
      });

      if (!merchant) throw new Error('Merchant not found!');

      const newItem = this.itemEntity.create({
        title: body.title,
        description: body.description,
        price: body.price,
        merchant: merchant,
      });

      const savedItem = await this.itemEntity.save(newItem);

      if (body.specifications && body.specifications.length > 0) {
        savedItem.specifications = body.specifications.map((spec) => {
          return this.specificationEntity.create({
            name: spec.name,
            value: spec.value,
            item: savedItem,
          });
        });

        await this.specificationEntity.save(savedItem.specifications);
      }

      return HttpStatus.CREATED;
    } catch (error) {
      console.error();
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  async updateItem(body: ItemCreateDto, id: number) {
    try {
      const itemExist = await this.itemEntity.findOne({ where: { id: id } });

      if (!itemExist) throw new NotFoundException('Item not found');

      const updatedItem = Object.assign(itemExist, body);
      this.itemEntity.save(updatedItem);

      return HttpStatus.NO_CONTENT;
    } catch (error) {
      console.error();
    }
  }

  async deleteItem(id: number) {
    try {
      const item = await this.itemEntity.findOne({ where: { id: id } });
      if (!item) throw new NotFoundException('Item not found');
      await this.itemEntity.delete(id);
    } catch (error) {
      console.error();
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
