import { Test, TestingModule } from '@nestjs/testing';
import { NewsController } from './news.controller';
import { CACHE_MANAGER } from '@nestjs/common';

describe('NewsController', () => {
    let controller: NewsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [NewsController],
            providers: [{ provide: CACHE_MANAGER, useValue: {} }]
        }).compile();

        controller = module.get<NewsController>(NewsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});