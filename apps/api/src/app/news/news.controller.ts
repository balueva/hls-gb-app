import {
    Body, Controller, Get, Header, Post, Inject, CACHE_MANAGER
} from '@nestjs/common';
import { Cache } from 'cache-manager';

import { IsNotEmpty } from 'class-validator';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NewsDocument, News } from './news.schema';

import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

export class CreateNewsDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;
}


@Controller('news')
export class NewsController {

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache,
        @InjectModel('News') private newsModel: Model<NewsDocument>,
        @InjectRedis() private readonly redis: Redis) { }

    @Get()
    async getNews() {

        let cachedNews: News[] | null = await this.cacheManager.get('news');

        if (!cachedNews) {
            console.log('news are not in the cache');
            cachedNews = await this.newsModel.find().exec();
            await this.cacheManager.set('news', cachedNews);
        }
        else
            console.log('news are in the cache');

        return new Promise(resolve => {
            setTimeout(() => {
                resolve(cachedNews);
            }, 100)
        });
    }

    // для простоты при создании новости автоматически формируем автора как строка author + № минуты
    // для формирования рейтинга используем сотриоованный список редиса
    // при создании новости сразу же добавляем автора в список для рейтинга 
    // и выводим в консоль и новую новость, и получившийся рейтинг
    @Post()
    @Header('Cache-Control', 'none')
    async create(@Body() peaceOfNews: CreateNewsDto) {
        const d = new Date();
        const author = `author ${d.getMinutes()}`;
        const newNews = new this.newsModel({ ...peaceOfNews, createdAt: d.getTime(), author });

        console.log('newNews = ', newNews);
        this.redis.zincrby('top', '1.0', author);

        const top = await this.redis.zrevrange('top', 0, 9, 'WITHSCORES');
        console.log('top = ', top);

        return await newNews.save();
    }

}


