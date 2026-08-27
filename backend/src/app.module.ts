import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule'; // 🌟 Імпорт планувальника
import { CarsModule } from './cars/cars.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BrandsModule } from './brands/brands.module';
import { CurrencyModule } from './currency/currency.module'; // 🌟 Імпорт модуля валют

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    ScheduleModule.forRoot(), // 🌟 Запускаємо планувальник (Cron)
    CurrencyModule,           // 🌟 Підключаємо модуль валют
    CarsModule,
    UsersModule,
    AuthModule,
    BrandsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}