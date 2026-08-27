export interface Car {
    _id: string;
    brand: string;
    model: string;
    price: number;
    year: number;
    mileage: number;
    city: string;
    fuelType: string;
    transmission: string;
    engineVolume?: number;
    image?: string;
    createdAt: string;
    currency?: string;
    priceUSD?: number;
    priceEUR?: number;
    priceUAH?: number;
    exchangeRateInfo?: string;
    description?: string;
    status?: string;
    editAttempts?: number;
}