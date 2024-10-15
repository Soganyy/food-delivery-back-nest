import { Injectable, NotFoundException } from '@nestjs/common';
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
    const merchant = await this.merchantService.findOne({
      email: user.email,
      password: user.password,
    });

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

    return savedItem;
  }

  async updateItem(body: ItemCreateDto, id: number): Promise<ItemResponseDto> {
    const itemExist = await this.itemEntity.findOne({ where: { id: id } });

    if (!itemExist) throw new NotFoundException('Item not found');

    const updatedItem = Object.assign(itemExist, body);
    const savedItem = await this.itemEntity.save(updatedItem);

    return plainToInstance(ItemResponseDto, {
      id: savedItem.id,
      title: savedItem.title,
      description: savedItem.description,
      price: savedItem.price,
      merchantId: savedItem.merchant.id,
    });
  }

  async deleteItem(id: number): Promise<void> {
    const item = await this.itemEntity.findOne({ where: { id: id } });

    if (!item) throw new NotFoundException('Item not found');
    await this.itemEntity.delete(id);
  }
}
