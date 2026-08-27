import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BrandRequestDocument = BrandRequest & Document;

@Schema({ timestamps: true })
export class BrandRequest {
    @Prop({ required: true })
    brandName: string; // Which brand is the user asking to add?

    @Prop({ default: 'pending' }) // Statuses: pending, resolved (added), rejected
    status: string;
}

export const BrandRequestSchema = SchemaFactory.createForClass(BrandRequest);