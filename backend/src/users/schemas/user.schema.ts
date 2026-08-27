import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Role } from '../enums/roles.enum';
import { Permission } from '../enums/permissions.enum';
import { AccountType } from '../enums/account-type.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    email: string;

    @Prop({ required: true })
    passwordHash: string; // Пароль зберігаємо виключно в захешованому вигляді

    @Prop({ type: String, enum: Role, default: Role.BUYER })
    role: Role;

    @Prop({ type: [String], enum: Permission, default: [Permission.EDIT_OWN_AD, Permission.DELETE_OWN_AD] })
    permissions: Permission[];

    @Prop({ type: String, enum: AccountType, default: AccountType.BASIC })
    accountType: AccountType;

    // 🌟 Закладка на майбутнє для автосалонів (Multi-tenancy)
    @Prop({ type: Types.ObjectId, ref: 'Organization', default: null })
    organizationId: Types.ObjectId | null;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }], default: [] })
    favoriteCars: mongoose.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);