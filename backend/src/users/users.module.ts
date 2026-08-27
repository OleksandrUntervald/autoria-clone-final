import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { PremiumRequest, PremiumRequestSchema } from './schemas/premium-request.schema'; // 🌟 Імпорт

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: PremiumRequest.name, schema: PremiumRequestSchema } // 🌟 Реєстрація моделі
        ])
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}