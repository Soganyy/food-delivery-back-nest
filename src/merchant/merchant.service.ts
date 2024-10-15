import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/auth/dto/login.dto';
import { Merchant } from './merchant.entity';
import { Repository } from 'typeorm';
import { RolesEnum } from 'src/enums/roles.enum';
import { RegisterMerchantDto } from 'src/auth/dto/merchantRegister..dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(Merchant)
    private readonly merchantEntity: Repository<Merchant>,
  ) {}

  async findOne(body: LoginDto) {
    const merchant = await this.merchantEntity.findOne({
      where: { email: body.email },
    });
    if (!merchant)
      throw new HttpException(
        "The merchant doesn't exist",
        HttpStatus.BAD_REQUEST,
      );

    return merchant;
  }

  async createMerchant(body: RegisterMerchantDto) {
    const ismerchantExist = await this.merchantEntity.findOne({
      where: { email: body.email },
    });
    if (ismerchantExist)
      throw new HttpException(
        'This merchant already exists',
        HttpStatus.BAD_REQUEST,
      );

    const merchant = this.merchantEntity.create({
      ...body,
      role: RolesEnum.Merchant,
    });
    const result = await this.merchantEntity.save(merchant);

    return result;
  }

  async getMerchantById(id: number) {
    const merchant = await this.merchantEntity.findOne({
      where: { id: id },
    });

    if (!merchant)
      throw new HttpException(
        "The merchant doesn't exist",
        HttpStatus.BAD_REQUEST,
      );

    return merchant;
  }

  async getMerchants() {
    const merchants = await this.merchantEntity.find();
    return instanceToPlain(merchants);
  }

  async updateMerchantLocation(
    userId: number,
    latitude: number,
    longitude: number,
  ) {
    const locationPoint = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };
    await this.merchantEntity.update(userId, { location: locationPoint });
    return { message: 'Location updated successfully' };
  }
}
