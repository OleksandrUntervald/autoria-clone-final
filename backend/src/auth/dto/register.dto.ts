import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional() // 🌟 Додай це, щоб поле було необов'язковим
    role?: string;
}