'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '../../../../config/api';
import { useRouter, useParams } from 'next/navigation';

export default function EditCarPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [phone, setPhone] = useState(''); // 🌟 Телефон для редагування
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await fetch(`${API_URL}/cars/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setDescription(data.description || '');
                    setPrice(data.price || '');
                    setPhone(data.phone || ''); // 🌟 Завантажуємо поточний телефон
                }
            } catch (error) {
                console.error('Помилка завантаження авто:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCar();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Будь ласка, увійдіть в систему!');
            return;
        }

        try {
            const res = await fetch(`${API_URL}/cars/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    description,
                    price: Number(price),
                    phone //  Відправляємо оновлений телефон
                })
            });

            if (res.ok) {
                alert('✅ Оголошення успішно оновлено та активовано!');
                router.push('/profile');
            } else {
                const errorData = await res.json();
                alert(`⚠️ ${errorData.message}`);

                if (errorData.message.includes('Ви вичерпали ліміт')) {
                    router.push('/profile');
                }
            }
        } catch (error) {
            console.error('Помилка при оновленні авто:', error);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Завантаження...</div>;

    return (
        <div className="max-w-2xl mx-auto p-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Редагування оголошення</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Ціна ($)</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="p-3 border rounded-xl w-full focus:outline-orange-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Контактний телефон</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="p-3 border rounded-xl w-full focus:outline-orange-500"
                        placeholder="+380..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Опис автомобіля</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="p-3 border rounded-xl w-full focus:outline-orange-500 min-h-[150px]"
                    />
                    <p className="text-xs text-gray-400 mt-1">Видаліть нецензурну лексику, щоб оголошення стало активним.</p>
                </div>

                <div className="flex gap-3 mt-4">
                    <button
                        type="button"
                        onClick={() => router.push('/profile')}
                        className="bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold p-3 rounded-xl transition-all w-1/3"
                    >
                        Скасувати
                    </button>
                    <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold p-3 rounded-xl transition-all shadow-sm w-2/3"
                    >
                        Зберегти зміни
                    </button>
                </div>
            </form>
        </div>
    );
}