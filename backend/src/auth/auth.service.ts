import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto) {
        console.log('Дані, які прийшли з Postman:', dto);
        const existingUser = await this.userModel.findOne({ email: dto.email });
        if (existingUser) {
            throw new BadRequestException('Користувач з таким email вже існує');
        }

        // 2. Hash the password (10 rounds of "salt")
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // 3. Saving to the database
        const newUser = new this.userModel({
            ...dto,
            passwordHash: hashedPassword,
        });
        const savedUser = await newUser.save();

        // 4. 🌟 Constructing the payload for the JWT token of a newly created user (automatic login).
        const payload = {
            sub: savedUser._id,
            email: savedUser.email,
            role: savedUser.role,
            permissions: savedUser.permissions,
            accountType: savedUser.accountType,
            organizationId: savedUser.organizationId,
        };

        // 5. Returning the token and the user object.
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: savedUser._id,
                email: savedUser.email,
                role: savedUser.role,
                accountType: savedUser.accountType
            }
        };
    }

    async login(dto: LoginDto) {
        // 1. Looking for a user
        const user = await this.userModel.findOne({ email: dto.email });
        if (!user) {
            throw new UnauthorizedException('Невірний email або пароль');
        }

        // 2. Checking the password
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Невірний email або пароль');
        }

        // 3. 🌟 Constructing the payload for the JWT token
        const payload = {
            sub: user._id,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
            accountType: user.accountType,
            organizationId: user.organizationId,
        };

        // 4. Generate and return the token.
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                accountType: user.accountType
            }
        };
    }
}