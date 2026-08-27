import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { Brand, BrandSchema } from './schemas/brand.schema';
import { BrandRequest, BrandRequestSchema } from './schemas/brand-request.schema'; // 🌟 Додано

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Brand.name, schema: BrandSchema },
            { name: BrandRequest.name, schema: BrandRequestSchema } // 🌟 Додано
        ])
    ],
    controllers: [BrandsController],
    providers: [BrandsService],
})
export class BrandsModule {}