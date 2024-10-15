import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Courier } from './courier.entity';
import { LoginDto } from 'src/auth/dto/login.dto';
import { Repository } from 'typeorm';
import { RegisterCourierDto } from 'src/auth/dto/courierRegister.dto';
import { RolesEnum } from 'src/enums/roles.enum';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CourierService {
  constructor(
    @InjectRepository(Courier)
    private courierEntity: Repository<Courier>,
  ) {}

  async findOne(body: LoginDto) {
    const courier = await this.courierEntity.findOne({
      where: { email: body.email },
    });

    if (!courier)
      throw new HttpException(
        "This courier doesn't exist",
        HttpStatus.BAD_REQUEST,
      );

    return courier;
  }

  async createCourier(body: RegisterCourierDto) {
    const isCourierExist = await this.courierEntity.findOne({
      where: { email: body.email },
    });

    if (isCourierExist)
      throw new HttpException(
        'This courier already exist',
        HttpStatus.BAD_REQUEST,
      );

    const courier = this.courierEntity.create({
      ...body,
      role: RolesEnum.Courier,
    });
    const result = await this.courierEntity.save(courier);

    return result;
  }
}
