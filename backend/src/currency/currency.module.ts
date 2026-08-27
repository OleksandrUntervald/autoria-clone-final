import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CurrencyService } from './currency.service';

@Global()
@Module({
    imports: [HttpModule],
    providers: [CurrencyService],
    exports: [CurrencyService], // Allow other modules to use this service.
})
export class CurrencyModule {}