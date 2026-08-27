import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from './schemas/brand.schema';
import { BrandRequest, BrandRequestDocument } from './schemas/brand-request.schema';

@Injectable()
export class BrandsService implements OnModuleInit {
    constructor(
        @InjectModel(Brand.name) private brandModel: Model<BrandDocument>,
        @InjectModel(BrandRequest.name) private brandRequestModel: Model<BrandRequestDocument>
    ) {}

    // 🌟 Automatic population of the database with popular brands upon startup
    async onModuleInit() {
        const count = await this.brandModel.countDocuments();
        if (count === 0) {
            const initialBrands = [
                {
                    name: 'Toyota',
                    models: ['Camry', 'RAV4', 'Corolla', 'Land Cruiser', 'Prius', 'Yaris', 'Highlander', 'Avensis']
                },
                {
                    name: 'BMW',
                    models: ['3 Series', '5 Series', 'X5', 'X3', 'X6', '7 Series', '1 Series', 'X1', '4 Series']
                },
                {
                    name: 'Audi',
                    models: ['A4', 'A6', 'Q7', 'Q5', 'A3', 'Q3', 'A8', 'Q8', 'A5']
                },
                {
                    name: 'Volkswagen',
                    models: ['Passat', 'Golf', 'Tiguan', 'Touareg', 'Jetta', 'Polo', 'Arteon', 'Transporter']
                },
                {
                    name: 'Skoda',
                    models: ['Octavia', 'Fabia', 'Superb', 'Kodiaq', 'Karoq', 'Rapid', 'Yeti']
                },
                {
                    name: 'Renault',
                    models: ['Megane', 'Logan', 'Duster', 'Scenic', 'Captur', 'Kadjar', 'Koleos', 'Sandero']
                },
                {
                    name: 'Hyundai',
                    models: ['Tucson', 'Elantra', 'Santa Fe', 'Sonata', 'Accent', 'Kona', 'Ioniq', 'Matrix']
                },
                {
                    name: 'Kia',
                    models: ['Sportage', 'Ceed', 'Sorento', 'Rio', 'Optima', 'Stinger', 'Soul', 'Cerato']
                },
                {
                    name: 'Mazda',
                    models: ['3', '6', 'CX-5', 'CX-30', 'CX-9', 'MX-5', 'CX-3', '2']
                },
                {
                    name: 'Ford',
                    models: ['Focus', 'Mondeo', 'Fiesta', 'Kuga', 'Edge', 'Mustang', 'Explorer', 'Transit']
                },
                {
                    name: 'Mercedes-Benz',
                    models: ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'ML-Class', 'A-Class', 'G-Class', 'CLA']
                },
                {
                    name: 'Nissan',
                    models: ['Qashqai', 'X-Trail', 'Leaf', 'Rogue', 'Juke', 'Navara', 'Sentra', 'Micra']
                },
                {
                    name: 'Honda',
                    models: ['Civic', 'Accord', 'CR-V', 'HR-V', 'Pilot', 'Jazz']
                },
                {
                    name: 'Lexus',
                    models: ['RX', 'NX', 'ES', 'GX', 'LX', 'IS', 'UX']
                },
                {
                    name: 'Tesla',
                    models: ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck']
                },
                {
                    name: 'Daewoo',
                    models: ['Lanos', 'Sens', 'Matiz', 'Nubira', 'Leganza', 'Nexia']
                }
            ];

            await this.brandModel.insertMany(initialBrands);
            console.log('🚗 Популярні марки та моделі авто успішно додано в базу даних!');
        }
    }

    // Get all brands (for the frontend dropdown list)
    async findAll() {
        return this.brandModel.find().sort({ name: 1 }).exec();
    }

    // create new mark
    async create(createBrandDto: { name: string; models: string[] }) {
        const brand = new this.brandModel(createBrandDto);
        return brand.save();
    }

    // Save request for a missing brand
    async requestMissingBrand(brandName: string) {
        const newRequest = new this.brandRequestModel({ brandName });
        return newRequest.save();
    }
}