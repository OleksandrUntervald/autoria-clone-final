import { Controller, Get, Post, Body } from '@nestjs/common';
import { BrandsService } from './brands.service';

@Controller('brands')
export class BrandsController {
    constructor(private readonly brandsService: BrandsService) {}

    @Get()
    findAll() {
        return this.brandsService.findAll();
    }

    @Post()
    create(@Body() createBrandDto: { name: string; models: string[] }) {
        return this.brandsService.create(createBrandDto);
    }

    // 🌟 new road
    @Post('request')
    requestBrand(@Body() body: { brandName: string }) {
        return this.brandsService.requestMissingBrand(body.brandName);
    }
}