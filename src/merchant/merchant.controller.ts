import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MerchantService } from './merchant.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { RolesEnum } from 'src/enums/roles.enum';
import { MerchantLocationUpdateDto } from './dto/merchant.location.update.dto';

@Controller('merchant')
@ApiTags('Merchant')
export class MerchantController {
  constructor(private merchantService: MerchantService) {}

  @Get()
  getMerchants() {
    return this.merchantService.getMerchants();
  }

  @Put('location')
  @Roles(RolesEnum.Merchant)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  updateMerchantLocation(
    @Body() body: MerchantLocationUpdateDto,
    @Req() req: any,
  ) {
    return this.merchantService.updateMerchantLocation(
      req.user.id,
      body.latitude,
      body.longitude,
    );
  }
}
