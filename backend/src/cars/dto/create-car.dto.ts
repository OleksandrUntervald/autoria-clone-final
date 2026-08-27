import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCarDto {
    @ApiProperty({ example: 'Mazda', description: 'Марка автомобіля' })
    @IsString()
    brand: string;

    @ApiProperty({ example: '3', description: 'Модель автомобіля' })
    @IsString()
    model: string;

    @ApiProperty({ example: 6500, description: 'Ціна' })
    @IsNumber()
    price: number;

    @ApiPropertyOptional({ example: 'USD', description: 'Валюта' })
    @IsOptional()
    @IsString()
    currency?: string;

    @ApiProperty({ example: 2008, description: 'Рік випуску' })
    @IsNumber()
    year: number;

    @ApiProperty({ example: 180000, description: 'Пробіг у кілометрах' })
    @IsNumber()
    mileage: number;

    @ApiProperty({ example: 'Київ', description: 'Місто розташування' })
    @IsString()
    city: string;

    @ApiProperty({ example: 'Бензин', description: 'Тип палива' })
    @IsString()
    fuelType: string;

    @ApiProperty({ example: 'Ручна', description: 'Коробка передач' })
    @IsString()
    transmission: string;

    @ApiPropertyOptional({ example: '2.0', description: 'Об\'єм двигуна' })
    @IsOptional()
    @IsString()
    engineVolume?: string;

    // 🌟 ОСЬ ВОНО! Дозволяємо бекенду приймати опис!
    @ApiPropertyOptional({ example: 'Класний автомобіль', description: 'Опис автомобіля' })
    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    @IsOptional()
    phone?: string;
}