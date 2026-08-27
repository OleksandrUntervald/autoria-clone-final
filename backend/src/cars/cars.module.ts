import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { Car, CarSchema } from './schemas/car.schema';
import { User, UserSchema } from '../users/schemas/user.schema'; // 🌟 Імпортуємо UserSchema

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Car.name, schema: CarSchema },
      { name: User.name, schema: UserSchema } // 🌟 Реєструємо User model
    ]),
  ],
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}