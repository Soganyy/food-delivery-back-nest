import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RegisterUserDto } from 'src/auth/dto/userRegister.dto';
import { UserService } from 'src/user/user.service';
import { RegisterMerchantDto } from './dto/merchantRegister..dto';
import { MerchantService } from 'src/merchant/merchant.service';
import { CourierService } from 'src/courier/courier.service';
import { RolesEnum } from 'src/enums/roles.enum';
import { RegisterCourierDto } from './dto/courierRegister.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private merchantService: MerchantService,
    private courierService: CourierService,
    private jwtService: JwtService,
  ) {}

  async loginUser(body: LoginDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(body);
    if (user?.password !== body.password) {
      throw new UnauthorizedException();
    }
    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      role: RolesEnum.User,
    };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async registerUser(body: RegisterUserDto) {
    return await this.usersService.createUser(body);
  }

  async loginMerchant(body: LoginDto): Promise<{ access_token: string }> {
    const merchant = await this.merchantService.findOne(body);
    if (merchant?.password !== body.password) {
      throw new UnauthorizedException();
    }
    const payload = {
      id: merchant.id,
      email: merchant.email,
      firstName: merchant.firstName,
      lastName: merchant.lastName,
      phoneNumber: merchant.phoneNumber,
      address: merchant.address,
      businessName: merchant.businessName,
      role: RolesEnum.Merchant,
    };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async registerMerchant(body: RegisterMerchantDto) {
    return await this.merchantService.createMerchant(body);
  }

  async loginCourier(body: LoginDto) {
    const courier = await this.courierService.findOne(body);
    if (courier?.password !== body.password) throw new UnauthorizedException();
    const payload = {
      id: courier.id,
      email: courier.email,
      phoneNumber: courier.phoneNumber,
      firstName: courier.firstName,
      lastName: courier.lastName,
      vehicle: courier.vehicle,
      role: RolesEnum.Courier,
    };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async registerCourier(body: RegisterCourierDto) {
    return await this.courierService.createCourier(body);
  }
}
