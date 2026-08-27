import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './helpers/multer.config';

// Імпорти для захисту
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/roles.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

// Імпорти Swagger
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiParam } from '@nestjs/swagger';

@ApiTags('Cars (Автомобілі)')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Створити нове оголошення (Тільки Продавець/Адмін)' })
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image', multerConfig))
  create(
      @Body() createCarDto: CreateCarDto,
      @UploadedFile() file: Express.Multer.File,
      @CurrentUser() user: any
  ) {
    const carData = {
      ...createCarDto,
      image: file ? `/uploads/${file.filename}` : undefined,
    };
    return this.carsService.create(carData, user.userId || user.sub);
  }

  @Get('my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отримати список власних автомобілів' })
  @UseGuards(AuthGuard('jwt'))
  findMyCars(@CurrentUser() user: any) {
    return this.carsService.findMyCars(user.userId || user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати список всіх автомобілів (з фільтрами)' })
  findAll(@Query() query: any) {
    return this.carsService.findAll(query);
  }

  // 🌟 Менеджер / Адмін: Отримати список заблокованих оголошень на перевірку
  @Get('manager/pending')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.MANAGER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отримати список заблокованих оголошень на перевірку (Менеджер/Адмін)' })
  getPendingCars(@CurrentUser() user: any) {
    return this.carsService.getPendingCarsForManager(user);
  }

  // 🌟 Статистика оголошення обов'язково ПЕРЕД :id
  @Get(':id/stats')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отримати статистику оголошення (Тільки Преміум)' })
  @UseGuards(AuthGuard('jwt'))
  getCarStats(@Param('id') id: string, @CurrentUser() user: any) {
    return this.carsService.getCarStats(id, user.userId || user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати автомобіль за ID' })
  @ApiParam({ name: 'id', description: 'Унікальний ідентифікатор автомобіля' })
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  // 🌟 Менеджер / Адмін: Ухвалити рішення по заблокованому оголошенню
  @Patch(':id/resolve')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.MANAGER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Розблокувати або видалити заблоковане авто (Менеджер/Адмін)' })
  @ApiParam({ name: 'id', description: 'ID автомобіля' })
  resolveCar(
      @Param('id') id: string,
      @Body('action') action: 'approve' | 'reject',
      @CurrentUser() user: any
  ) {
    return this.carsService.resolvePendingCar(id, action, user);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Оновити оголошення (Власник/Адмін/Менеджер)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN, Role.MANAGER) // 👈 Додано MANAGER та ADMIN
  update(
      @Param('id') id: string,
      @Body() updateCarDto: UpdateCarDto,
      @CurrentUser() user: any
  ) {
    return this.carsService.update(id, updateCarDto, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Видалити оголошення (Власник/Адмін/Менеджер)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN, Role.MANAGER) // 👈 Додано MANAGER та ADMIN
  remove(
      @Param('id') id: string,
      @CurrentUser() user: any
  ) {
    return this.carsService.remove(id, user);
  }
}