import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6, { message: 'Пароль має бути мінімум 6 символів' })
    password: string;
}