import { Body, Controller, Param, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserLocationUpdateDto } from './dto/user.location.update.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { RolesEnum } from 'src/enums/roles.enum';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Put('location')
  @Roles(RolesEnum.User)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  updateUserLocation(@Body() body: UserLocationUpdateDto, @Req() req: any) {
    return this.userService.updateUserLocation(
      req.user.id,
      body.latitude,
      body.longitude,
    );
  }
}
