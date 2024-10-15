import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/auth/dto/login.dto';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/auth/dto/userRegister.dto';
import { RegisterMerchantDto } from './dto/merchantRegister..dto';
import { RegisterCourierDto } from './dto/courierRegister.dto';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('user/login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Login end-point',
    isArray: false,
  })
  loginUser(@Body() body: LoginDto) {
    return this.authService.loginUser(body);
  }

  @Post('user/register')
  @HttpCode(HttpStatus.OK)
  registerUser(@Body() body: RegisterUserDto) {
    return this.authService.registerUser(body);
  }

  @Post('merchant/login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Login end-point',
    isArray: false,
  })
  loginMerchant(@Body() body: LoginDto) {
    return this.authService.loginMerchant(body);
  }

  @Post('merchant/register')
  @HttpCode(HttpStatus.OK)
  registerMerchant(@Body() body: RegisterMerchantDto) {
    return this.authService.registerMerchant(body);
  }

  @Post('courier/login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Login end-point',
    isArray: false,
  })
  loginCourier(@Body() body: LoginDto) {
    return this.authService.loginCourier(body);
  }

  @Post('courier/register')
  @HttpCode(HttpStatus.OK)
  registerCourier(@Body() body: RegisterCourierDto) {
    return this.authService.registerCourier(body);
  }
}
