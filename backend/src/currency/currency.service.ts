import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CurrencyService implements OnModuleInit {
    private readonly logger = new Logger(CurrencyService.name);

    // Тут ми зберігатимемо актуальні курси в пам'яті
    public rates = { USD: 0, EUR: 0 };

    constructor(private readonly httpService: HttpService) {}

    // Цей метод спрацює автоматично одразу при старті сервера
    async onModuleInit() {
        await this.fetchRates();
    }

    // Цей декоратор запускає метод щодня рівно опівночі
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleCron() {
        await this.fetchRates();
    }

    async fetchRates() {
        try {
            this.logger.log('🔄 Отримання актуальних курсів валют з ПриватБанку...');

            // Робимо запит до API Привату
            const response = await firstValueFrom(
                this.httpService.get('https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5')
            );

            const data = response.data;

            // Шукаємо курси продажу (sale)
            const usd = data.find((r: any) => r.ccy === 'USD');
            const eur = data.find((r: any) => r.ccy === 'EUR');

            if (usd) this.rates.USD = parseFloat(usd.sale);
            if (eur) this.rates.EUR = parseFloat(eur.sale);

            this.logger.log(`✅ Курси успішно оновлено: USD = ${this.rates.USD}, EUR = ${this.rates.EUR}`);
        } catch (error) {
            this.logger.error('❌ Помилка при отриманні курсів валют', error);
        }
    }
}