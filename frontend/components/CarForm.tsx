import { useState, useEffect } from 'react';
import { API_URL } from '../config/api';

interface CarFormProps {
    onSuccess: () => void;
}

export default function CarForm({ onSuccess }: CarFormProps) {
    const [brandList, setBrandList] = useState<any[]>([]);
    const [availableModels, setAvailableModels] = useState<string[]>([]);

    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [year, setYear] = useState('');
    const [mileage, setMileage] = useState('');
    const [city, setCity] = useState('');
    const [fuelType, setFuelType] = useState('Бензин');
    const [transmission, setTransmission] = useState('Автомат');
    const [engineVolume, setEngineVolume] = useState('');
    const [phone, setPhone] = useState(''); // 🌟 НОВЕ ПОЛЕ: Телефон

    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);

    const [isMissingBrand, setIsMissingBrand] = useState(false);
    const [missingBrandName, setMissingBrandName] = useState('');

    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [premiumPhone, setPremiumPhone] = useState('');

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await fetch(`${API_URL}/brands`);
                if (res.ok) {
                    const data = await res.json();
                    setBrandList(data);
                }
            } catch (error) {
                console.error('Помилка завантаження марок:', error);
            }
        };
        fetchBrands();
    }, []);

    const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedBrand = e.target.value;

        if (selectedBrand === 'MISSING') {
            setIsMissingBrand(true);
            setBrand('');
            setAvailableModels([]);
            return;
        }

        setIsMissingBrand(false);
        setBrand(selectedBrand);
        setModel('');

        const foundBrand = brandList.find(b => b.name === selectedBrand);
        if (foundBrand) {
            setAvailableModels(foundBrand.models);
        } else {
            setAvailableModels([]);
        }
    };

    const submitMissingBrand = async () => {
        if (!missingBrandName.trim()) {
            alert('Будь ласка, введіть назву марки!');
            return;
        }
        try {
            const res = await fetch(`${API_URL}/brands/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ brandName: missingBrandName })
            });

            if (res.ok) {
                alert(`Дякуємо! Запит на додавання марки "${missingBrandName}" відправлено адміністрації.`);
                setIsMissingBrand(false);
                setMissingBrandName('');
            }
        } catch (error) {
            console.error('Помилка відправки:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Будь ласка, увійдіть в систему, щоб додати авто!');
            return;
        }

        if (!brand || !model || !price || !year || !mileage || !city) {
            alert('Будь ласка, заповніть усі обов’язкові поля');
            return;
        }

        const formData = new FormData();
        formData.append('brand', brand);
        formData.append('model', model);
        formData.append('price', price);
        formData.append('currency', currency);
        formData.append('year', year);
        formData.append('mileage', mileage);
        formData.append('city', city);
        formData.append('fuelType', fuelType);
        formData.append('transmission', transmission);
        if (engineVolume) formData.append('engineVolume', engineVolume);
        if (phone) formData.append('phone', phone); // 🌟 Додаємо телефон у запит
        if (description) formData.append('description', description);
        if (image) formData.append('image', image);

        try {
            const res = await fetch(`${API_URL}/cars`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (res.ok) {
                setBrand(''); setModel(''); setPrice(''); setCurrency('USD'); setYear(''); setMileage(''); setCity('');
                setFuelType('Бензин'); setTransmission('Автомат'); setEngineVolume(''); setPhone('');
                setDescription('');
                setImage(null);
                setAvailableModels([]);

                const fileInput = document.getElementById('car-image-input') as HTMLInputElement;
                if (fileInput) fileInput.value = '';

                onSuccess();
            } else {
                const errorData = await res.json();
                if (res.status === 403 && errorData.message.includes('Базовий акаунт')) {
                    setShowPremiumModal(true);
                } else {
                    alert(`Помилка: ${errorData.message}`);
                }
            }
        } catch (error) {
            console.error('Помилка при додаванні авто:', error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 relative">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Створити оголошення про продаж</h2>

            <div className="mb-4">
                <select
                    value={isMissingBrand ? 'MISSING' : brand}
                    onChange={handleBrandChange}
                    className="p-2.5 border rounded-xl bg-white focus:outline-orange-500 w-full md:w-1/3"
                >
                    <option value="" disabled>Оберіть марку</option>
                    {brandList.map((b) => (
                        <option key={b._id} value={b.name}>{b.name}</option>
                    ))}
                    <option disabled>──────────</option>
                    <option value="MISSING">❓ Немає моєї марки (Повідомити)</option>
                </select>
            </div>

            {isMissingBrand ? (
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-2">Повідомити про відсутню марку</h3>
                    <p className="text-sm text-blue-700 mb-4">Напишіть, якої марки не вистачає, і наші менеджери оперативно додадуть її до списку!</p>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Наприклад: Tesla"
                            value={missingBrandName}
                            onChange={(e) => setMissingBrandName(e.target.value)}
                            className="p-2.5 border rounded-xl flex-grow focus:outline-blue-500"
                        />
                        <button
                            type="button"
                            onClick={submitMissingBrand}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 rounded-xl transition-colors"
                        >
                            Відправити
                        </button>
                    </div>
                    <button onClick={() => setIsMissingBrand(false)} className="text-sm text-gray-500 underline mt-3 hover:text-gray-800">
                        Повернутися до списку
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        disabled={!brand}
                        className="p-2.5 border rounded-xl bg-white focus:outline-orange-500 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                        <option value="" disabled>Оберіть модель</option>
                        {availableModels.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>

                    <div className="flex gap-2">
                        <input type="number" placeholder="Ціна" value={price} onChange={(e) => setPrice(e.target.value)} className="p-2.5 border rounded-xl focus:outline-orange-500 w-2/3" />
                        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="p-2.5 border rounded-xl bg-white focus:outline-orange-500 w-1/3 font-bold text-gray-700 text-center">
                            <option value="USD">$</option>
                            <option value="EUR">€</option>
                            <option value="UAH">₴</option>
                        </select>
                    </div>

                    <input type="number" placeholder="Рік випуску" value={year} onChange={(e) => setYear(e.target.value)} className="p-2.5 border rounded-xl focus:outline-orange-500" />
                    <input type="number" placeholder="Пробіг (км)" value={mileage} onChange={(e) => setMileage(e.target.value)} className="p-2.5 border rounded-xl focus:outline-orange-500" />
                    <input type="text" placeholder="Місто" value={city} onChange={(e) => setCity(e.target.value)} className="p-2.5 border rounded-xl focus:outline-orange-500" />

                    {/* 🌟 Поле для введення телефону */}
                    <input type="text" placeholder="Контактний телефон (напр. +380...)" value={phone} onChange={(e) => setPhone(e.target.value)} className="p-2.5 border rounded-xl focus:outline-orange-500 md:col-span-3" />

                    <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="p-2.5 border rounded-xl bg-white focus:outline-orange-500">
                        <option value="Бензин">Бензин</option>
                        <option value="Дизель">Дизель</option>
                        <option value="Газ">Газ</option>
                        <option value="Газ/Бензин">Газ / Бензин</option>
                        <option value="Електро">Електро</option>
                    </select>

                    <select value={transmission} onChange={(e) => setTransmission(e.target.value)} className="p-2.5 border rounded-xl bg-white focus:outline-orange-500">
                        <option value="Автомат">Автомат</option>
                        <option value="Механіка">Механіка</option>
                    </select>

                    <input type="number" step="0.1" placeholder="Об'єм двигуна (л)" value={engineVolume} onChange={(e) => setEngineVolume(e.target.value)} className="p-2.5 border rounded-xl focus:outline-orange-500" />

                    <textarea
                        placeholder="Опис автомобіля..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="md:col-span-3 p-3 border rounded-xl focus:outline-orange-500 min-h-[100px]"
                    />

                    <div className="md:col-span-3 bg-gray-50 p-3 rounded-xl border border-dashed border-gray-300">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Фотографія автомобіля</label>
                        <input id="car-image-input" type="file" accept="image/*" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} className="text-sm text-gray-600 w-full" />
                    </div>

                    <button type="submit" className="md:col-span-3 bg-orange-500 hover:bg-orange-600 text-white font-bold p-3 rounded-xl transition-all shadow-sm">
                        Розмістити в каталозі
                    </button>
                </form>
            )}

            {showPremiumModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-3xl shadow-xl max-w-md w-full border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                            ⭐
                        </div>
                        <h3 className="text-xl font-extrabold text-gray-800 mb-2">Ліміт оголошень вичерпано</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            На Базовому акаунті можна розмістити лише 1 оголошення. Залиште ваш номер телефону для зв'язку з менеджером.
                        </p>
                        <input
                            type="text"
                            placeholder="Введіть ваш телефон"
                            value={premiumPhone}
                            onChange={(e) => setPremiumPhone(e.target.value)}
                            className="w-full p-3 border rounded-2xl mb-4 focus:outline-orange-500 text-sm"
                        />
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setShowPremiumModal(false)} className="bg-gray-100 text-gray-700 font-bold p-3 rounded-2xl w-1/2">
                                Скасувати
                            </button>
                            <button type="button" onClick={async () => {
                                if (!premiumPhone.trim()) return alert('Введіть телефон!');
                                const token = localStorage.getItem('token');
                                await fetch(`${API_URL}/users/request-premium`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                    body: JSON.stringify({ phone: premiumPhone })
                                });
                                alert('Запит прийнято!');
                                setShowPremiumModal(false);
                            }} className="bg-orange-500 text-white font-bold p-3 rounded-2xl w-1/2">
                                Надіслати
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}