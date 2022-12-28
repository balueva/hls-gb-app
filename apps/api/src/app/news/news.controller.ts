import {
    Body, Controller, Get, Header, Post, Inject, CACHE_MANAGER
} from '@nestjs/common';
import { Cache } from 'cache-manager';

import { IsNotEmpty } from 'class-validator';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NewsDocument, News } from './news.schema';

export class CreateNewsDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;
}


@Controller('news')
export class NewsController {

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache,
        @InjectModel('News') private newsModel: Model<NewsDocument>) { }

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

    @Post()
    @Header('Cache-Control', 'none')
    async create(@Body() peaceOfNews: CreateNewsDto) {
        const newNews = new this.newsModel({ ...peaceOfNews, createdAt: Date.now() });

        return await newNews.save();
    }
}