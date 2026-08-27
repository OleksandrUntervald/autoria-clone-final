'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Car } from '../types/car';
import { API_URL } from '../config/api';

interface CarCardProps {
    car: Car;
}

export default function CarCard({ car }: CarCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);

    const toggleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Будь ласка, увійдіть в систему, щоб додавати авто в обране!');
                return;
            }

            const res = await fetch(`${API_URL}/users/favorites/${car._id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setIsFavorite(!isFavorite);
            } else {
                console.error('Помилка при додаванні в обране');
            }
        } catch (error) {
            console.error('Помилка мережі:', error);
        }
    };

    // 🌟 Безпечне визначення головної валюти (якщо раптом це старе оголошення)
    const mainCurrency = car.currency || 'USD';

    return (
        <Link href={`/cars/${car._id}`} className="block group relative">
            <button
                onClick={toggleLike}
                className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow border border-gray-100 hover:bg-gray-50 transition-all transform active:scale-95"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={isFavorite ? "#ef4444" : "none"}
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke={isFavorite ? "#ef4444" : "currentColor"}
                    className="w-5 h-5 text-gray-500"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row hover:shadow-md hover:border-orange-300 transition-all h-full">

                <div className="w-full md:w-44 h-48 md:h-full bg-gray-200 relative flex-shrink-0 min-h-[180px]">
                    {car.image ? (
                        <img
                            src={`${API_URL}${car.image}`}
                            alt={`${car.brand} ${car.model}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs font-semibold">
                            📸 Немає фото
                        </div>
                    )}
                </div>

                <div className="p-5 flex flex-col justify-between flex-grow">
                    <div>
                        <div className="flex justify-between items-start gap-2 pr-8">
                            <h3 className="text-xl font-extrabold text-blue-900 uppercase group-hover:text-orange-500 transition-colors">
                                {car.brand} <span className="text-gray-700 font-semibold text-lg">{car.model}</span>
                            </h3>
                            <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md flex-shrink-0">
                                {car.year} р.
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 my-3 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-xl">
                            <div>📍 {car.city}</div>
                            <div>🛣️ {(car.mileage / 1000).toFixed(0)} тис. км</div>
                            <div>⛽ {car.fuelType} {car.engineVolume ? `${car.engineVolume}л` : ''}</div>
                            <div>⚙️ {car.transmission}</div>
                        </div>
                    </div>

                    {/* 🌟 ОНОВЛЕНИЙ БЛОК ЦІНИ */}
                    <div className="pt-2 border-t border-gray-100 flex justify-between items-end mt-auto">
                        <div className="flex flex-col">
                            {/* Головна ціна */}
                            <span className="text-2xl font-black text-green-600 leading-none">
                                {car.price.toLocaleString()} {mainCurrency === 'USD' ? '$' : mainCurrency === 'EUR' ? '€' : '₴'}
                            </span>

                            {/* Додаткові ціни */}
                            {car.priceUSD && (
                                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium mt-1">
                                    {mainCurrency !== 'USD' && <span>~ {car.priceUSD.toLocaleString()} $</span>}
                                    {mainCurrency !== 'USD' && mainCurrency !== 'EUR' && <span>•</span>}

                                    {mainCurrency !== 'EUR' && <span>~ {car.priceEUR?.toLocaleString()} €</span>}
                                    {mainCurrency !== 'UAH' && mainCurrency !== 'EUR' && <span>•</span>}

                                    {mainCurrency !== 'UAH' && <span>~ {car.priceUAH?.toLocaleString()} ₴</span>}

                                    {/* Іконка з підказкою курсу */}
                                    {car.exchangeRateInfo && (
                                        <span className="ml-1 cursor-help" title={car.exchangeRateInfo}>ℹ️</span>
                                    )}
                                </div>
                            )}
                        </div>

                        <span className="text-[10px] text-gray-400 pb-0.5">
                            {new Date(car.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                </div>
            </div>
        </Link>
    );
}