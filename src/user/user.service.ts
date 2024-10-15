import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from '../auth/dto/login.dto';
import { RegisterUserDto } from '../auth/dto/userRegister.dto';
import { RolesEnum } from 'src/enums/roles.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(body: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: body.email },
    });
    if (!user)
      throw new HttpException("The user doesn't exist", HttpStatus.BAD_REQUEST);

    return user;
  }

  async createUser(body: RegisterUserDto) {
    const isUserExist = await this.userRepository.findOne({
      where: { email: body.email },
    });
    if (isUserExist)
      throw new HttpException(
        'This user already exists',
        HttpStatus.BAD_REQUEST,
      );

    const user = this.userRepository.create({ ...body, role: RolesEnum.User });
    const result = await this.userRepository.save(user);

    return result;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user)
      throw new HttpException("The user doesn't exist", HttpStatus.BAD_REQUEST);

    return user;
  }

  async updateUserLocation(
    userId: number,
    latitude: number,
    longitude: number,
  ) {
    const locationPoint = {
      type: 'Point',
      coordinates: [longitude, latitude], // Ensure these are valid coordinates
    };
    await this.userRepository.update(userId, { location: locationPoint });
    return { message: 'Location updated successfully' };
  }
}
