import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CarDocument = Car & Document;

@Schema({ timestamps: true })
export class Car {
    @Prop({ required: true })
    brand: string;

    @Prop({ required: true })
    model: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true, default: 'USD' })
    currency: string;

    @Prop({ required: false })
    priceUSD?: number;

    @Prop({ required: false })
    priceEUR?: number;

    @Prop({ required: false })
    priceUAH?: number;

    @Prop({ required: false })
    exchangeRateInfo?: string;

    @Prop({ required: true })
    year: number;

    @Prop({ required: true })
    mileage: number;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    fuelType: string;

    @Prop({ required: true })
    transmission: string;

    @Prop({ required: false })
    engineVolume?: number;

    //   Опис автомобіля
    @Prop({ required: false })
    description?: string;

    //  Статус оголошення (active, rejected, pending_manager)
    @Prop({ default: 'active' })
    status: string;

    //   Лічильник спроб редагування
    @Prop({ default: 0 })
    editAttempts: number;

    @Prop({ type: [Date], default: [] })
    views: Date[];

    @Prop({ required: false })
    image?: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    owner: mongoose.Types.ObjectId;
}

export const CarSchema = SchemaFactory.createForClass(Car);