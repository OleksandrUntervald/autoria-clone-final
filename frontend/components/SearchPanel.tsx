interface SearchPanelProps {
    searchBrand: string;
    setSearchBrand: (value: string) => void;
    searchCity: string;
    setSearchCity: (value: string) => void;
    searchTransmission: string;
    setSearchTransmission: (value: string) => void;
    searchPriceMin: string;
    setSearchPriceMin: (value: string) => void;
    searchPriceMax: string;
    setSearchPriceMax: (value: string) => void;
    // 🌟 Нові пропси для років та сортування
    searchYearMin: string;
    setSearchYearMin: (value: string) => void;
    searchYearMax: string;
    setSearchYearMax: (value: string) => void;
    sortBy: string;
    setSortBy: (value: string) => void;
    onClear: () => void;
}

export default function SearchPanel({
                                        searchBrand, setSearchBrand,
                                        searchCity, setSearchCity,
                                        searchTransmission, setSearchTransmission,
                                        searchPriceMin, setSearchPriceMin,
                                        searchPriceMax, setSearchPriceMax,
                                        searchYearMin, setSearchYearMin,
                                        searchYearMax, setSearchYearMax,
                                        sortBy, setSortBy,
                                        onClear
                                    }: SearchPanelProps) {
    return (
        <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-md mb-8">
            <div className="flex justify-between items-center mb-4 border-b border-blue-800 pb-2">
                <h2 className="text-xl font-bold">Швидкий пошук та сортування</h2>
                <button onClick={onClear} className="text-xs bg-blue-800 hover:bg-blue-700 text-gray-300 px-3 py-1 rounded-lg transition">
                    Скинути всі фільтри
                </button>
            </div>

            {/* Гібридна сітка: блоки адаптивно розбиваються */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

                {/* Рядок 1: Текстові фільтри */}
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase font-bold text-blue-300 tracking-wider">Марка</label>
                    <input type="text" placeholder="Наприклад: Jeep..." value={searchBrand} onChange={(e) => setSearchBrand(e.target.value)} className="p-2.5 rounded-xl bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase font-bold text-blue-300 tracking-wider">Місто</label>
                    <input type="text" placeholder="Усі міста..." value={searchCity} onChange={(e) => setSearchCity(e.target.value)} className="p-2.5 rounded-xl bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase font-bold text-blue-300 tracking-wider">Коробка передач</label>
                    <select value={searchTransmission} onChange={(e) => setSearchTransmission(e.target.value)} className="p-2.5 rounded-xl bg-white text-gray-900 text-sm focus:outline-none h-[42px]">
                        <option value="">Будь-яка КПП</option>
                        <option value="Автомат">Автомат</option>
                        <option value="Механіка">Механіка</option>
                    </select>
                </div>

                {/* 🌟 НОВЕ: Сортування */}
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase font-bold text-orange-400 tracking-wider">Сортувати за</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2.5 rounded-xl bg-white text-gray-900 text-sm font-semibold focus:outline-none h-[42px] border-l-4 border-orange-400">
                        <option value="">🕒 Спочатку нові оголошення</option>
                        <option value="price_asc">📉 Від дешевих до дорогих</option>
                        <option value="price_desc">📈 Від дорогих до дешевих</option>
                        <option value="year_desc">🚗 Спочатку новіші авто</option>
                        <option value="year_asc">👴 Спочатку старіші авто</option>
                        <option value="oldest">⏳ Спочатку старі оголошення</option>
                    </select>
                </div>

                {/* Рядок 2: Діапазони цін та років */}
                <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-[11px] uppercase font-bold text-blue-300 tracking-wider">Ціна ($)</label>
                    <div className="grid grid-cols-2 gap-2">
                        <input type="number" placeholder="Від" value={searchPriceMin} onChange={(e) => setSearchPriceMin(e.target.value)} className="p-2.5 rounded-xl bg-white text-gray-900 text-sm focus:outline-none" />
                        <input type="number" placeholder="До" value={searchPriceMax} onChange={(e) => setSearchPriceMax(e.target.value)} className="p-2.5 rounded-xl bg-white text-gray-900 text-sm focus:outline-none" />
                    </div>
                </div>

                {/* 🌟 НОВЕ: Фільтр років від / до */}
                <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-[11px] uppercase font-bold text-blue-300 tracking-wider">Рік випуску</label>
                    <div className="grid grid-cols-2 gap-2">
                        <input type="number" placeholder="Рік від" value={searchYearMin} onChange={(e) => setSearchYearMin(e.target.value)} className="p-2.5 rounded-xl bg-white text-gray-900 text-sm focus:outline-none" />
                        <input type="number" placeholder="Рік до" value={searchYearMax} onChange={(e) => setSearchYearMax(e.target.value)} className="p-2.5 rounded-xl bg-white text-gray-900 text-sm focus:outline-none" />
                    </div>
                </div>

            </div>
        </div>
    );
}