import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) { // 🌟 Прибрали "private"
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'AutoRiaSuperSecretKey2026_!@#',
        });
    }

    async validate(payload: any) {
        // Everything we return here will be available in `request.user`.
        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
            permissions: payload.permissions
        };
    }
}