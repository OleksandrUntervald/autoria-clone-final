import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BrandDocument = Brand & Document;

@Schema({ timestamps: true })
export class Brand {
    @Prop({ required: true, unique: true })
    name: string; // Brand name, for example "BMW" or "Mazda"

    @Prop({ type: [String], default: [] })
    models: string[]; // An array of models, for example ["X5", "M3", "320i"]
}

export const BrandSchema = SchemaFactory.createForClass(Brand);