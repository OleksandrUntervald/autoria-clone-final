'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {API_URL} from "@/config/api";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true); // true = Вхід, false = Реєстрація
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        // Якщо реєструємося - передаємо ім'я та стандартну роль покупця
        const body = isLogin
            ? { email, password }
            : { email, password, name, role: 'seller' };

        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (res.ok) {
                // 🌟 Зберігаємо токен у пам'ять браузера
                localStorage.setItem('token', data.accessToken || data.access_token);

                // Очищаємо форму
                setEmail('');
                setPassword('');
                setName('');

                // 🌟 Перекидаємо користувача на головну сторінку
                router.push('/');
            } else {
                // Показуємо помилку з бекенду (наприклад: "Невірний пароль")
                setError(data.message || 'Щось пішло не так');
            }
        } catch (err) {
            setError('Помилка з\'єднання з сервером');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8">

                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-extrabold text-orange-500 uppercase tracking-wider hover:opacity-80 transition-opacity">
                        Auto.ria Clone
                    </Link>
                    <h2 className="text-xl font-bold text-gray-800 mt-4">
                        {isLogin ? 'Вхід у систему' : 'Створення акаунту'}
                    </h2>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100 text-center">
                        {Array.isArray(error) ? error[0] : error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ваше ім'я</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                placeholder="Іван Іванов"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            placeholder="mail@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Зачекайте...' : (isLogin ? 'Увійти' : 'Зареєструватися')}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    {isLogin ? 'Ще немає акаунту?' : 'Вже маєте акаунт?'}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        className="ml-2 text-orange-500 font-bold hover:underline"
                    >
                        {isLogin ? 'Створити зараз' : 'Увійти'}
                    </button>
                </div>

            </div>
        </div>
    );
}