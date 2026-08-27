'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '../../config/api';
import Link from 'next/link';
import { Car } from '../../types/car';

export default function ProfilePage() {
    const [myCars, setMyCars] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMyCars = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const res = await fetch(`${API_URL}/cars/my`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMyCars(data);
                }
            } catch (error) {
                console.error('Помилка завантаження авто:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyCars();
    }, []);

    if (isLoading) return <div className="p-8 text-center text-gray-500">Завантаження...</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Кабінет продавця</h1>
                <Link href="/" className="text-blue-600 hover:underline font-medium">
                    + Додати нове авто
                </Link>
            </div>

            {myCars.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-2xl text-center border border-gray-200">
                    <p className="text-gray-500">У вас ще немає оголошень.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {myCars.map(car => (
                        <div key={car._id} className="border border-gray-200 p-5 rounded-2xl flex flex-col md:flex-row justify-between md:items-center bg-white shadow-sm hover:shadow transition-shadow">
                            <div className="mb-4 md:mb-0">
                                <h3 className="font-extrabold text-lg text-blue-900 uppercase">
                                    {car.brand} <span className="text-gray-700">{car.model}</span>
                                </h3>
                                <p className="text-green-600 font-bold text-lg mb-2">
                                    {car.price.toLocaleString()} {car.currency || '$'}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {car.status === 'active' && <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-xs font-bold border border-green-200">✅ Активне</span>}
                                    {car.status === 'rejected' && <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-md text-xs font-bold border border-red-200">❌ Відхилено (Матюки) • Спроб: {car.editAttempts}/3</span>}
                                    {car.status === 'pending_manager' && <span className="bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-md text-xs font-bold border border-yellow-200">⏳ Заблоковано (Перевірка менеджером)</span>}
                                    {!car.status && <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-xs font-bold border border-green-200">✅ Активне (Старе)</span>}
                                </div>
                            </div>

                            <div className="flex gap-2 w-full md:w-auto">
                                <Link
                                    href={`/cars/${car._id}/edit`}
                                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-xl text-sm font-bold flex-1 md:flex-none transition-colors text-center inline-block"
                                >
                                    Редагувати
                                </Link>
                                <button className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-sm font-bold flex-1 md:flex-none transition-colors">
                                    Видалити
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}