import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryUpdateDto } from './dto/update.category.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { RolesEnum } from 'src/enums/roles.enum';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(RolesEnum.Merchant)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  async createCategory(@Body() body: any) {
    return this.categoryService.createCategory(body);
  }

  @Get()
  async getAllCategories() {
    return this.categoryService.findAllCategories();
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: number) {
    return this.categoryService.findCategoryById(id);
  }

  @Put(':id')
  @Roles(RolesEnum.Merchant)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  async updateCategory(
    @Param('id') id: number,
    @Body() updateDto: CategoryUpdateDto,
  ) {
    return this.categoryService.updateCategory(id, updateDto);
  }

  @Delete(':id')
  @Roles(RolesEnum.Merchant)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  async deleteCategory(@Param('id') id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
