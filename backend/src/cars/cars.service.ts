import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDocument } from './schemas/car.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { AccountType } from '../users/enums/account-type.enum';
import { Role } from '../users/enums/roles.enum';
import { CurrencyService } from '../currency/currency.service';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class CarsService {

  private readonly logger = new Logger(CarsService.name);

  private readonly badWords = [
    'дурень', 'дурепа', 'дурак', 'дурко', 'дурилка', 'дурний', 'дурна', 'дурнуватий', 'дурнувата',
    'тупий', 'тупа', 'тупак', 'тупиця', 'тупенький', 'тупорилий', 'тупорила',
    'ідіот', 'ідіотка', 'ідіотський', 'ідіотизм', 'дебіл', 'дебілка', 'дебільний', 'дебілізм', 'дебілоїд',
    'кретин', 'кретинка', 'кретинський', 'придурок', 'придурка', 'придуркуватий', 'придуркувата', 'придурошний',
    'довбень', 'довбонутий', 'довбонута', 'бовдур', 'бовдурка', 'бовдурище',
    'недоумок', 'недоумка', 'недоумкуватий', 'імбецил', 'імбецилка', 'імбецильний',
    'дегенерат', 'дегенератка', 'дегенеративний', 'відбитий', 'відбита',
    'безмозкий', 'безмозка', 'безголовий', 'безголова', 'мозгоклюй', 'мозгожер',
    'лох', 'лошара', 'лошок', 'лохушка', 'лохотронщик', 'лохотронщиця',
    'скотина', 'падло', 'падлюка', 'сволота', 'сволоч', 'мерзотник', 'мерзотниця', 'мерзота',
    'покидьок', 'покидьки', 'наволоч', 'гнида', 'тварина', 'тварюка', 'виродок', 'виродка',
    'нелюд', 'нелюдь', 'збоченець', 'збоченка', 'збочений', 'збочена', 'маніяк', 'маніячка',
    'психопат', 'психопатка', 'шизик', 'шизанутий', 'шизанута', 'відморозок', 'відморозки',
    'непотріб', 'лайно', 'говнюк', 'говнючка', 'гівнюк', 'гівнючка', 'засранець', 'засранка',
    'смердюк', 'смердючка', 'смердючий', 'смердюча',
    'бля', 'бляха', 'блядь', 'блядство', 'блядіна', 'блядота', 'блядський', 'блядська', 'блядське',
    'сука', 'сучка', 'сучий', 'суча', 'суче', 'сучість', 'сучара',
    'хуй', 'хуя', 'хує', 'хуйн', 'хуйня', 'хуйню', 'хуйовий', 'хуйова', 'хуйове', 'хуйово',
    'хуесос', 'хуєсос', 'хуйлo', 'хуйло', 'хуйлан', 'хуйньо',
    'пизда', 'пізда', 'пиздець', 'піздець', 'пиздец', 'піздец', 'пиздюк', 'піздюк',
    'пиздюлина', 'піздюлина', 'пиздолиз', 'піздолиз', 'пиздота', 'піздота', 'пиздити', 'піздити',
    'ебать', 'єбать', 'ебав', 'єбав', 'ебаний', 'єбаний', 'ебана', 'єбана', 'ебане', 'єбане',
    'ебанутий', 'єбанутий', 'ебанута', 'єбанута', 'еблан', 'єблан', 'еблани', 'єбло', 'єбало', 'ебало',
    'ебашити', 'єбашити', 'їбати', 'йобаний', 'йобнути', 'йобнув', 'йобнула',
    'заїбати', 'заебати', 'заїбав', 'заебал', 'заїбала', 'заебала', 'заїбись', 'заебись', 'відїбись',
    'уебок', 'уєбок', 'уїбок', 'уебаний', 'уєбаний', 'уїбаний', 'виблядок', 'виблядка', 'недоєбок', 'недоебок',
    'курва', 'курвa', 'курвий', 'курвас', 'курвитися', 'курвиться',
    'говно', 'гівно', 'говняний', 'гівняний', 'говняна', 'гівняна', 'говняне', 'гівняне',
    'говняк', 'гівняк', 'обісрати', 'обісрав', 'обісрана', 'обісраний', 'насрати', 'насрав', 'насрана',
    'срати', 'срав', 'сраний', 'срана', 'срака', 'сраку', 'засрати', 'засраний', 'засрана',
    'висрати', 'висрав', 'висрана', 'висер',
    'нікчема', 'нікчемний', 'нікчемна', 'жалюгідний', 'жалюгідна', 'жалюгідне', 'бездарність',
    'бездарний', 'бездарна', 'погань', 'мерзляк', 'смерд', 'брехун', 'брехуха', 'брехло',
    'шахрай', 'шахрайка', 'аферист', 'аферистка', 'паразит', 'дармоїд', 'дармоїдка',
    'нахлібник', 'нахлібниця', 'підлабузник', 'підлабузниця', 'лизоблюд', 'лизоблюдка',
    'здохни', 'здохнути', 'ублюдок', 'ублюдка', 'байстрюк', 'байстрючка', 'покруч',
    'виродження', 'мразь', 'мразота', 'паскуда', 'паскудник', 'паскудниця', 'паскудний', 'паскудна',
    'гад', 'гадина', 'гадюка', 'гадський', 'гидота', 'гидкий', 'гидка', 'мерзлятина'
  ];

  constructor(
      @InjectModel(Car.name) private carModel: Model<CarDocument>,
      @InjectModel(User.name) private userModel: Model<UserDocument>,
      private currencyService: CurrencyService
  ) {}

  private checkProfanity(text: string): boolean {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return this.badWords.some(word => lowerText.includes(word));
  }

  private notifyManager(carId: string, ownerId: string) {
    this.logger.warn(`🚨 [EMAIL TO MANAGER] Оголошення ${carId} (автор: ${ownerId}) заблоковано через систематичне використання нецензурної лексики!`);
  }

  private calculatePrices(price: number, currency: string) {
    const rates = this.currencyService.rates;
    let priceUSD = 0, priceEUR = 0, priceUAH = 0;

    if (currency === 'UAH') {
      priceUAH = price; priceUSD = price / rates.USD; priceEUR = price / rates.EUR;
    } else if (currency === 'EUR') {
      priceEUR = price; priceUAH = price * rates.EUR; priceUSD = priceUAH / rates.USD;
    } else {
      priceUSD = price; priceUAH = price * rates.USD; priceEUR = priceUAH / rates.EUR;
    }

    const exchangeRateInfo = `Розраховано за курсом ПриватБанку: 1 USD = ${rates.USD} UAH, 1 EUR = ${rates.EUR} UAH. Оригінальна ціна: ${price} ${currency}.`;
    return { priceUSD: Math.round(priceUSD), priceEUR: Math.round(priceEUR), priceUAH: Math.round(priceUAH), exchangeRateInfo };
  }

  async create(carData: any, ownerId: string) {
    const user = await this.userModel.findById(ownerId);
    if (!user) throw new NotFoundException('Користувача не знайдено');

    // 🌟 Менеджери та Адміни не мають жодних лімітів на кількість оголошень
    const userRole = user.role?.toLowerCase();
    const isAdminOrManager = userRole === Role.ADMIN || userRole === Role.MANAGER;

    if (!isAdminOrManager && user.accountType === AccountType.BASIC) {
      const carCount = await this.carModel.countDocuments({ owner: ownerId });
      if (carCount >= 1) throw new ForbiddenException('У вас Базовий акаунт. Ви можете розмістити лише 1 оголошення. Придбайте Преміум!');
    }

    const currency = carData.currency || 'USD';
    const prices = this.calculatePrices(Number(carData.price), currency);

    const textToCheck = `${carData.brand} ${carData.model} ${carData.city} ${carData.description || ''}`;
    const isDirty = this.checkProfanity(textToCheck);

    const createdCar = new this.carModel({
      ...carData,
      currency,
      ...prices,
      status: isDirty ? 'rejected' : 'active',
      editAttempts: isDirty ? 1 : 0,
      owner: ownerId,
      views: [],
    });

    await createdCar.save();

    if (isDirty) {
      throw new BadRequestException('Увага! Оголошення містить нецензурну лексику. Його збережено в чернетки. Відредагуйте текст!');
    }
    return createdCar;
  }

  async findAll(query: any) {
    const filter: any = {
      $or: [
        { status: 'active' },
        { status: { $exists: false } }
      ]
    };

    if (query.brand) filter.brand = new RegExp(query.brand, 'i');
    if (query.city) filter.city = new RegExp(query.city, 'i');
    if (query.transmission) filter.transmission = query.transmission;

    if (query.priceMin || query.priceMax) {
      filter.price = {};
      if (query.priceMin) filter.price.$gte = Number(query.priceMin);
      if (query.priceMax) filter.price.$lte = Number(query.priceMax);
    }

    if (query.yearMin || query.yearMax) {
      filter.year = {};
      if (query.yearMin) filter.year.$gte = Number(query.yearMin);
      if (query.yearMax) filter.year.$lte = Number(query.yearMax);
    }

    let sortOptions: any = { createdAt: -1 };
    if (query.sortBy) {
      switch (query.sortBy) {
        case 'price_asc': sortOptions = { price: 1 }; break;
        case 'price_desc': sortOptions = { price: -1 }; break;
        case 'year_desc': sortOptions = { year: -1 }; break;
        case 'year_asc': sortOptions = { year: 1 }; break;
        case 'oldest': sortOptions = { createdAt: 1 }; break;
      }
    }

    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await this.carModel.countDocuments(filter).exec();
    const data = await this.carModel.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('owner', 'name email')
        .exec();

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findMyCars(userId: string) {
    return this.carModel.find({ owner: userId }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Car> {
    const car = await this.carModel.findById(id).populate('owner', 'name email').exec();
    if (!car) throw new NotFoundException(`Автомобіль з ID ${id} не знайдено`);

    if (!car.views) car.views = [];
    car.views.push(new Date());
    await car.save();

    return car;
  }

  //  Статистика для Преміум акаунтів
  async getCarStats(carId: string, userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Користувача не знайдено');

    const userRole = user.role?.toLowerCase();
    if (user.accountType !== AccountType.PREMIUM && userRole !== Role.ADMIN) {
      throw new ForbiddenException('Статистика доступна лише для власників Преміум-акаунтів!');
    }

    const car = await this.carModel.findById(carId);
    if (!car) throw new NotFoundException('Автомобіль не знайдено');

    if (car.owner.toString() !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('Ви можете переглядати статистику лише власних оголошень!');
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const viewsList = car.views || [];
    const totalViews = viewsList.length;
    const viewsDay = viewsList.filter(date => new Date(date) >= oneDayAgo).length;
    const viewsWeek = viewsList.filter(date => new Date(date) >= oneWeekAgo).length;
    const viewsMonth = viewsList.filter(date => new Date(date) >= oneMonthAgo).length;

    const cityAgg = await this.carModel.aggregate([
      { $match: { brand: car.brand, model: car.model, city: car.city, status: 'active' } },
      { $group: { _id: null, avgPrice: { $avg: '$priceUSD' } } }
    ]);
    const avgCityPrice = cityAgg.length > 0 ? Math.round(cityAgg[0].avgPrice) : car.priceUSD;

    const countryAgg = await this.carModel.aggregate([
      { $match: { brand: car.brand, model: car.model, status: 'active' } },
      { $group: { _id: null, avgPrice: { $avg: '$priceUSD' } } }
    ]);
    const avgCountryPrice = countryAgg.length > 0 ? Math.round(countryAgg[0].avgPrice) : car.priceUSD;

    return {
      views: { total: totalViews, day: viewsDay, week: viewsWeek, month: viewsMonth },
      averages: { city: car.city, avgCityPriceUSD: avgCityPrice, avgCountryPriceUSD: avgCountryPrice }
    };
  }

  //  Менеджер / Адмін: Отримати список заблокованих оголошень на перевірку
  async getPendingCarsForManager(user: any) {
    const userRole = user.role?.toLowerCase();
    if (userRole !== Role.MANAGER && userRole !== Role.ADMIN) {
      throw new ForbiddenException('Доступно лише менеджерам та адміністраторам!');
    }
    return this.carModel.find({ status: 'pending_manager' }).populate('owner', 'name email').exec();
  }

  //  Менеджер / Адмін: Ухвалити рішення по заблокованому оголошенню
  async resolvePendingCar(carId: string, action: 'approve' | 'reject', user: any) {
    const userRole = user.role?.toLowerCase();
    if (userRole !== Role.MANAGER && userRole !== Role.ADMIN) {
      throw new ForbiddenException('Доступно лише менеджерам та адміністраторам!');
    }

    const car = await this.carModel.findById(carId);
    if (!car) throw new NotFoundException('Автомобіль не знайдено');

    if (action === 'approve') {
      car.status = 'active';
      car.editAttempts = 0;
      await car.save();
      return { message: 'Оголошення успішно розблоковано та активовано!' };
    } else {
      await this.carModel.findByIdAndDelete(carId);
      return { message: 'Оголошення остаточно видалено менеджером!' };
    }
  }

  async update(id: string, updateCarDto: any, user: any): Promise<Car> {
    const car = await this.carModel.findById(id).exec();
    if (!car) throw new NotFoundException(`Автомобіль з ID ${id} не знайдено`);

    const currentUserId = user.userId || user.sub;
    const userRole = user.role?.toLowerCase();
    const isAdminOrManager = userRole === Role.ADMIN || userRole === Role.MANAGER;

    if (!isAdminOrManager) {
      if (!car.owner) throw new ForbiddenException('Це старе оголошення без власника.');
      if (car.owner.toString() !== currentUserId) {
        throw new ForbiddenException('Ви можете редагувати лише власні оголошення!');
      }
      if (car.status === 'pending_manager') {
        throw new ForbiddenException('Це оголошення заблоковано і наразі перевіряється менеджером.');
      }
    }

    let updatedData = { ...updateCarDto };
    if (updatedData.price || updatedData.currency) {
      const newPrice = updatedData.price || car.price;
      const newCurrency = updatedData.currency || car.currency || 'USD';
      const prices = this.calculatePrices(Number(newPrice), newCurrency);
      updatedData = { ...updatedData, ...prices, currency: newCurrency };
    }

    let isDirty = false;
    if (!isAdminOrManager) {
      const textToCheck = `${updatedData.brand || car.brand} ${updatedData.description || car.description || ''}`;
      isDirty = this.checkProfanity(textToCheck);

      if (isDirty) {
        updatedData.editAttempts = (car.editAttempts || 0) + 1;
        if (updatedData.editAttempts >= 3) {
          updatedData.status = 'pending_manager';
          this.notifyManager(id, car.owner.toString());
        } else {
          updatedData.status = 'rejected';
        }
      } else {
        updatedData.status = 'active';
        updatedData.editAttempts = 0;
      }
    }

    const updatedCar = await this.carModel.findByIdAndUpdate(id, updatedData, { new: true })
        .populate('owner', 'name email')
        .exec();

    if (!updatedCar) throw new NotFoundException(`Помилка під час оновлення`);

    if (!isAdminOrManager) {
      if (isDirty && updatedData.editAttempts >= 3) {
        throw new BadRequestException('Ви вичерпали ліміт спроб (3/3)! Оголошення заблоковано і відправлено менеджеру.');
      } else if (isDirty) {
        throw new BadRequestException(`Увага! Нецензурна лексика. Залишилось спроб: ${3 - updatedData.editAttempts}`);
      }
    }

    return updatedCar as Car;
  }

  async remove(id: string, user: any): Promise<any> {
    const car = await this.carModel.findById(id).exec();
    if (!car) throw new NotFoundException(`Автомобіль з ID ${id} не знайдено`);

    const currentUserId = user.userId || user.sub;
    const userRole = user.role?.toLowerCase();
    const isAdminOrManager = userRole === Role.ADMIN || userRole === Role.MANAGER;

    if (!isAdminOrManager) {
      if (!car.owner) throw new ForbiddenException('Це старе оголошення без власника.');
      if (car.owner.toString() !== currentUserId) {
        throw new ForbiddenException('Ви можете видаляти лише власні оголошення!');
      }
    }

    if (car.image) {
      const imagePath = path.join(process.cwd(), car.image);
      try { await fs.unlink(imagePath); } catch (error) { console.error('Не вдалося видалити файл:', error); }
    }

    return this.carModel.findByIdAndDelete(id).exec();
  }
}