import {
    Body, Controller, Get, Header, Post, Inject, CACHE_MANAGER
} from '@nestjs/common';
import { Cache } from 'cache-manager';

import { IsNotEmpty } from 'class-validator';

export class CreateNewsDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;
}

export interface INews {
    id: number,
    title: string,
    description: string,
    createdAt: number
}

@Controller('news')
export class NewsController {

    private readonly news: INews[] = Object.keys([...Array(20)])
        .map(key => Number(key) + 1)
        .map(n => ({
            id: n,
            title: `Важная новость ${n}`,
            description: (rand => ([...Array(rand(1000))].map(() => rand(10 ** 16).toString(36).substring(rand(10))).join(' ')))(max => Math.ceil(Math.random() * max)),
            createdAt: Date.now()
        }));

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    @Get()
    async getNews() {

        let cachedNews: INews[] | null = await this.cacheManager.get('news');

        if (!cachedNews) {
            console.log('news are not in the cache');
            await this.cacheManager.set('news', this.news);
            cachedNews = [...this.news];
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

        const newNews: INews = {
            id: Math.ceil(Math.random() * 1000),
            ...peaceOfNews,
            createdAt: Date.now()
        };
        this.news.push(newNews);

        return new Promise(resolve => {
            setTimeout(() => {
                console.log('Новость успешно создана', newNews);
                resolve(newNews);
            }, 100)
        });
    }
}