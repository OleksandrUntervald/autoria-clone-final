import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './enums/roles.enum';

@ApiTags('Users (Користувачі / Вибране / Менеджери)')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('favorites')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Отримати список улюблених авто поточного користувача' })
    getFavorites(@CurrentUser() user: any) {
        return this.usersService.getFavorites(user.userId);
    }

    @Post('favorites/:carId')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Додати або видалити авто з вибраного (Тогл)' })
    @ApiParam({ name: 'carId', description: 'Унікальний ідентифікатор автомобіля' })
    toggleFavorite(
        @Param('carId') carId: string,
        @CurrentUser() user: any
    ) {
        return this.usersService.toggleFavorite(user.userId, carId);
    }

    @Post('request-premium')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Надіслати запит на отримання Преміум-акаунта' })
    requestPremium(
        @CurrentUser() user: any,
        @Body('phone') phone: string
    ) {
        return this.usersService.requestPremium(user.userId, phone);
    }

    // 🌟 Отримати список усіх користувачів (Тільки Адмін)
    @Get('all')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Отримати список усіх користувачів (Тільки Адмін)' })
    getAllUsers() {
        return this.usersService.findAllUsers();
    }

    // 🌟 Маршрут для адміністратора: призначити юзера менеджером
    @Post(':id/make-manager')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Призначити користувача менеджером (Тільки Адмін)' })
    @ApiParam({ name: 'id', description: 'ID користувача' })
    makeManager(@Param('id') id: string) {
        return this.usersService.makeManager(id);
    }
}