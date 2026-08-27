import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type PremiumRequestDocument = PremiumRequest & Document;

@Schema({ timestamps: true })
export class PremiumRequest {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user: mongoose.Types.ObjectId;

    @Prop({ required: true })
    email: string;

    // 🌟 НОВЕ: Телефон або контакт для зв'язку
    @Prop({ required: true })
    phone: string;

    @Prop({ default: 'pending' })
    status: string;
}

export const PremiumRequestSchema = SchemaFactory.createForClass(PremiumRequest);