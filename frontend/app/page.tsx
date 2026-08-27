'use client';

import { useState, useEffect } from 'react';
import { Car } from '../types/car';
import { API_URL } from '../config/api';
import CarCard from '../components/CarCard';
import CarForm from '../components/CarForm';
import SearchPanel from '../components/SearchPanel';
import Link from 'next/link';

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [searchBrand, setSearchBrand] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchTransmission, setSearchTransmission] = useState('');
  const [searchPriceMin, setSearchPriceMin] = useState('');
  const [searchPriceMax, setSearchPriceMax] = useState('');
  const [searchYearMin, setSearchYearMin] = useState('');
  const [searchYearMax, setSearchYearMax] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchCars = async () => {
    try {
      const params = new URLSearchParams();
      if (searchBrand) params.append('brand', searchBrand);
      if (searchCity) params.append('city', searchCity);
      if (searchTransmission) params.append('transmission', searchTransmission);
      if (searchPriceMin) params.append('priceMin', searchPriceMin);
      if (searchPriceMax) params.append('priceMax', searchPriceMax);
      if (searchYearMin) params.append('yearMin', searchYearMin);
      if (searchYearMax) params.append('yearMax', searchYearMax);
      if (sortBy) params.append('sortBy', sortBy);

      params.append('page', page.toString());
      params.append('limit', '2'); // По 2 авто на сторінку для тесту

      const res = await fetch(`${API_URL}/cars?${params.toString()}`);
      const responseBody = await res.json();

      setCars(responseBody.data || []);
      setTotalPages(responseBody.totalPages || 1);
    } catch (error) {
      console.error('Не вдалося завантажити авто:', error);
    }
  };

  useEffect(() => {
    fetchCars();
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [searchBrand, searchCity, searchTransmission, searchPriceMin, searchPriceMax, searchYearMin, searchYearMax, sortBy, page]);

  const handleClearFilters = () => {
    setSearchBrand(''); setSearchCity(''); setSearchTransmission('');
    setSearchPriceMin(''); setSearchPriceMax('');
    setSearchYearMin(''); setSearchYearMax(''); setSortBy('');
    setPage(1);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
      <main className="min-h-screen bg-gray-100 p-4 md:p-8 text-gray-900">
        <div className="max-w-5xl mx-auto">

          <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
            <h1 className="text-3xl font-extrabold text-orange-500 uppercase tracking-wider mb-4 md:mb-0">
              Auto.ria Clone
            </h1>

            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                  <>
                    <Link href="/favorites" className="text-gray-700 font-medium hover:text-orange-500 transition-colors flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                      Обране
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                    >
                      Вийти
                    </button>
                  </>
              ) : (
                  <Link
                      href="/login"
                      className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-sm"
                  >
                    Увійти
                  </Link>
              )}
            </div>
          </header>

          <SearchPanel
              searchBrand={searchBrand} setSearchBrand={setSearchBrand}
              searchCity={searchCity} setSearchCity={setSearchCity}
              searchTransmission={searchTransmission} setSearchTransmission={setSearchTransmission}
              searchPriceMin={searchPriceMin} setSearchPriceMin={setSearchPriceMin}
              searchPriceMax={searchPriceMax} setSearchPriceMax={setSearchPriceMax}
              searchYearMin={searchYearMin} setSearchYearMin={setSearchYearMin}
              searchYearMax={searchYearMax} setSearchYearMax={setSearchYearMax}
              sortBy={sortBy} setSortBy={setSortBy}
              onClear={handleClearFilters}
          />

          <CarForm onSuccess={fetchCars} />

          <h2 className="text-2xl font-bold mb-6 text-gray-800">Всі пропозиції на ринку</h2>

          {cars.length === 0 ? (
              <p className="text-gray-500 text-center py-12 bg-white rounded-2xl border">Нічого не знайдено.</p>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cars.map((car) => (
                    <CarCard key={car._id} car={car} />
                ))}
              </div>
          )}

          {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
                >
                  Попередня
                </button>

                <span className="text-gray-600 font-medium">
                Сторінка {page} з {totalPages}
              </span>

                <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
                >
                  Наступна
                </button>
              </div>
          )}

        </div>
      </main>
  );
}