import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { PremiumRequest, PremiumRequestDocument } from './schemas/premium-request.schema';
import { Role } from './enums/roles.enum';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(PremiumRequest.name) private premiumRequestModel: Model<PremiumRequestDocument>,
    ) {}

    // 🌟 1. Отримати всі збережені авто користувача
    async getFavorites(userId: string) {
        const user = await this.userModel
            .findById(userId)
            .populate('favoriteCars') // Підтягуємо повні дані машин
            .exec();

        if (!user) {
            throw new NotFoundException('Користувача не знайдено');
        }

        return user.favoriteCars;
    }

    // 🌟 2. Додати або видалити авто з вибраного (Тогл)
    async toggleFavorite(userId: string, carId: string) {
        const user = await this.userModel.findById(userId).exec();

        if (!user) {
            throw new NotFoundException('Користувача не знайдено');
        }

        const isFavorite = user.favoriteCars.some((id) => id.toString() === carId);

        if (isFavorite) {
            // Якщо є — видаляємо
            user.favoriteCars = user.favoriteCars.filter((id) => id.toString() !== carId);
        } else {
            // Якщо немає — додаємо в масив
            user.favoriteCars.push(carId as any);
        }

        await user.save();

        return {
            message: isFavorite ? 'Авто видалено з вибраного' : 'Авто додано до вибраного',
            favoriteCars: user.favoriteCars
        };
    }

    // 🌟 3. Запит на отримання Преміум-акаунта
    async requestPremium(userId: string, phone: string) {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('Користувача не знайдено');

        const existing = await this.premiumRequestModel.findOne({ user: userId, status: 'pending' });
        if (existing) {
            throw new BadRequestException('Ви вже подали запит на Преміум. Очікуйте на розгляд!');
        }

        const newRequest = new this.premiumRequestModel({
            user: userId,
            email: user.email,
            phone, // 🌟 Зберігаємо телефон
        });

        return newRequest.save();
    }

    // 🌟 4. Призначити користувача менеджером (Тільки Адмін)
    async makeManager(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('Користувача не знайдено');

        user.role = Role.MANAGER as any;
        await user.save();

        return { message: `Користувача ${user.email} успішно призначено менеджером!` };
    }
    // 🌟 Отримати список усіх користувачів (Тільки для Адміна)
    async findAllUsers() {
        return this.userModel.find().select('-passwordHash').sort({ createdAt: -1 }).exec();
    }
}