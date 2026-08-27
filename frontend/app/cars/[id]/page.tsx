'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Car } from '../../../types/car';
import { API_URL } from '../../../config/api';

export default function CarDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [car, setCar] = useState<Car | null>(null);
    const [stats, setStats] = useState<any>(null);
    const [isBasicOwner, setIsBasicOwner] = useState(false);
    const [premiumPhone, setPremiumPhone] = useState(''); // 🌟 Стейт для телефону преміум-запиту
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCarData = async () => {
            try {
                // 1. Отримуємо дані машини
                const res = await fetch(`${API_URL}/cars/${id}`);
                if (!res.ok) throw new Error('Автомобіль не знайдено в базі даних');
                const data = await res.json();
                setCar(data);

                // 2. Спробуємо отримати статистику (працює тільки для власника з Преміумом або Адміна)
                const token = localStorage.getItem('token');
                if (token) {
                    const statsRes = await fetch(`${API_URL}/cars/${id}/stats`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (statsRes.ok) {
                        const statsData = await statsRes.json();
                        setStats(statsData);
                    } else if (statsRes.status === 403) {
                        // Якщо 403, перевіряємо, чи це власник з базовим акаунтом
                        setIsBasicOwner(true);
                    }
                }
            } catch (err: any) {
                setError(err.message || 'Помилка завантаження');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCarData();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Ви впевнені, що хочете видалити це оголошення?')) return;

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Будь ласка, увійдіть в систему, щоб видалити авто!');
            return;
        }

        try {
            const res = await fetch(`${API_URL}/cars/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                alert('Оголошення успішно видалено');
                router.push('/');
            } else {
                const errorData = await res.json();
                alert(`Не вдалося видалити оголошення: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Помилка при видаленні:', error);
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500">Завантаження інформації про авто...</div>;
    if (error) return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;
    if (!car) return null;

    return (
        <main className="min-h-screen bg-gray-100 p-4 md:p-8 text-gray-900">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center text-sm font-semibold text-orange-500 hover:text-orange-600 mb-6 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 transition">
                    ← Назад до каталогу
                </Link>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 mb-6 gap-4">
                        <div>
                            <span className="text-sm font-bold uppercase tracking-wider text-orange-500 bg-orange-50 px-3 py-1 rounded-md">
                                {car.year} рік випуску
                            </span>
                            <h1 className="text-4xl font-black text-blue-950 uppercase mt-2">
                                {car.brand} <span className="text-gray-700 font-bold">{car.model}</span>
                            </h1>
                        </div>
                        <div className="text-left md:text-right">
                            <p className="text-xs text-gray-400 font-medium">Ціна автомобіля</p>
                            <p className="text-4xl font-black text-green-600">${car.price.toLocaleString()}</p>
                        </div>
                    </div>

                    {car.image && (
                        <div className="w-full h-80 md:h-96 rounded-2xl overflow-hidden mb-6 shadow-inner bg-gray-150">
                            <img
                                src={`${API_URL}${car.image}`}
                                alt={`${car.brand} ${car.model}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/*  КОНТАКТ ПРОДАВЦЯ */}
                    {(car as any).phone && (
                        <div className="bg-orange-50 border border-orange-200 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 shadow-sm">
                            <div>
                                <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">Контакт продавця</p>
                                <p className="text-2xl font-black text-gray-900 mt-0.5">{(car as any).phone}</p>
                            </div>
                            <a
                                href={`tel:${(car as any).phone}`}
                                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md text-center"
                            >
                                📞 Зателефонувати
                            </a>
                        </div>
                    )}

                    {/*  БЛОК СТАТИСТИКИ ДЛЯ ПРЕМІУМ-АККАУНТА */}
                    {stats && (
                        <div className="bg-blue-950 text-white p-6 rounded-2xl mb-8 shadow-md">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">⭐</span>
                                <h2 className="text-lg font-extrabold uppercase tracking-wide">Аналітика та статистика оголошення</h2>
                            </div>

                            {/* Перегляди */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                                <div className="bg-blue-900/60 p-3 rounded-xl border border-blue-800 text-center">
                                    <p className="text-xs text-blue-300 font-medium">Загалом</p>
                                    <p className="text-2xl font-black mt-1">{stats.views.total}</p>
                                </div>
                                <div className="bg-blue-900/60 p-3 rounded-xl border border-blue-800 text-center">
                                    <p className="text-xs text-blue-300 font-medium">За день</p>
                                    <p className="text-2xl font-black mt-1">{stats.views.day}</p>
                                </div>
                                <div className="bg-blue-900/60 p-3 rounded-xl border border-blue-800 text-center">
                                    <p className="text-xs text-blue-300 font-medium">За тиждень</p>
                                    <p className="text-2xl font-black mt-1">{stats.views.week}</p>
                                </div>
                                <div className="bg-blue-900/60 p-3 rounded-xl border border-blue-800 text-center">
                                    <p className="text-xs text-blue-300 font-medium">За місяць</p>
                                    <p className="text-2xl font-black mt-1">{stats.views.month}</p>
                                </div>
                            </div>

                            {/* Середні ціни */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-blue-900">
                                <div className="flex justify-between items-center bg-blue-900/40 p-3 rounded-xl">
                                    <span className="text-sm text-blue-200">📍 Середня ціна у м. {stats.averages.city}:</span>
                                    <span className="font-bold text-green-400">${stats.averages.avgCityPriceUSD.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center bg-blue-900/40 p-3 rounded-xl">
                                    <span className="text-sm text-blue-200">🇺🇦 Середня ціна по Україні:</span>
                                    <span className="font-bold text-green-400">${stats.averages.avgCountryPriceUSD.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/*  БАНЕР ТА ФОРМА ЗАПИТУ ПРЕМІУМУ ДЛЯ БАЗОВОГО АККАУНТА */}
                    {isBasicOwner && (
                        <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl mb-8 text-center shadow-sm">
                            <h3 className="font-extrabold text-gray-800 text-lg mb-2">🔒 Статистика прихована (Базовий акаунт)</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Оновіть акаунт до <span className="font-bold text-orange-500">Преміум</span>, щоб бачити кількість переглядів за день/тиждень/місяць та середні ринкові ціни. Залиште ваш номер, і менеджер зв'яжеться з вами!
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <input
                                    type="text"
                                    placeholder="Введіть ваш телефон (напр. +380...)"
                                    value={premiumPhone}
                                    onChange={(e) => setPremiumPhone(e.target.value)}
                                    className="p-3 border rounded-xl flex-grow focus:outline-orange-500 text-sm bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (!premiumPhone.trim()) {
                                            alert('Будь ласка, введіть номер телефону!');
                                            return;
                                        }
                                        try {
                                            const token = localStorage.getItem('token');
                                            const res = await fetch(`${API_URL}/users/request-premium`, {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${token}`
                                                },
                                                body: JSON.stringify({ phone: premiumPhone })
                                            });
                                            if (res.ok) {
                                                alert('🎉 Запит прийнято! Менеджер зателефонує вам найближчим часом.');
                                                setPremiumPhone('');
                                            } else {
                                                const err = await res.json();
                                                alert(`Помилка: ${err.message}`);
                                            }
                                        } catch (e) {
                                            console.error(e);
                                        }
                                    }}
                                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-sm text-sm"
                                >
                                    Чекаю дзвінка
                                </button>
                            </div>
                        </div>
                    )}

                    <h2 className="text-xl font-bold text-gray-800 mb-4">Характеристики автомобіля</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
                        <div className="flex justify-between border-b pb-2 text-sm">
                            <span className="text-gray-500">📍 Місто продажу:</span>
                            <span className="font-semibold text-gray-800">{car.city}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2 text-sm">
                            <span className="text-gray-500">🛣️ Реальний пробіг:</span>
                            <span className="font-semibold text-gray-800">{car.mileage.toLocaleString()} км</span>
                        </div>
                        <div className="flex justify-between border-b pb-2 text-sm">
                            <span className="text-gray-500">⛽ Тип палива:</span>
                            <span className="font-semibold text-gray-800">{car.fuelType}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2 text-sm">
                            <span className="text-gray-500">⚙️ Коробка передач:</span>
                            <span className="font-semibold text-gray-800">{car.transmission}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2 text-sm sm:col-span-2">
                            <span className="text-gray-500">🔌 Об'єм двигуна:</span>
                            <span className="font-semibold text-gray-800">{car.engineVolume ? `${car.engineVolume} л` : 'Не вказано / Електро'}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t gap-4">
                        <span className="text-xs text-gray-400 font-medium">
                          Опубліковано: {new Date(car.createdAt).toLocaleString()}
                        </span>
                        <button onClick={handleDelete} className="w-full sm:w-auto bg-red-50 hover:bg-red-100 text-red-600 font-bold px-5 py-2.5 rounded-xl border border-red-200 transition text-sm">
                            🗑️ Видалити оголошення
                        </button>
                    </div>

                </div>
            </div>
        </main>
    );
}