'use client';

import { useState, useEffect } from 'react';
import { Car } from '../../types/car';
import { API_URL } from '../../config/api';
import CarCard from '../../components/CarCard';
import Link from 'next/link';

export default function FavoritesPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            // Дістаємо пропуск
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                // Робимо запит на наш новий бекенд-метод getFavorites
                const res = await fetch(`${API_URL}/users/favorites`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setCars(data); // Бекенд повертає масив автомобілів з усіма даними (через populate)
                }
            } catch (error) {
                console.error('Помилка завантаження обраного:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    return (
        <main className="min-h-screen bg-gray-100 p-4 md:p-8 text-gray-900">
            <div className="max-w-5xl mx-auto">

                {/* Шапка сторінки */}
                <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                    <h1 className="text-2xl font-extrabold text-orange-500 uppercase tracking-wider mb-4 md:mb-0">
                        Моє Обране
                    </h1>
                    <Link
                        href="/"
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                    >
                        ← На головну
                    </Link>
                </header>

                {/* Список авто */}
                {isLoading ? (
                    <p className="text-center text-gray-500 py-12">Завантаження...</p>
                ) : cars.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
                        <div className="text-5xl mb-4">💔</div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Тут поки що порожньо</h2>
                        <p className="text-gray-500 mb-6">Ви ще не додали жодного авто до вибраного.</p>
                        <Link href="/" className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors">
                            Перейти до каталогу
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {cars.map((car) => (
                            <CarCard key={car._id} car={car} />
                        ))}
                    </div>
                )}

            </div>
        </main>
    );
}