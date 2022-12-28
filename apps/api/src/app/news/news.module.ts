import { Module, CacheModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsController/*, NewsSchema*/ } from './news.controller';
import { NewsSchema } from './news.schema';

@Module({
    imports: [CacheModule.register(),
    MongooseModule.forFeature([{ name: 'News', schema: NewsSchema }])],
    controllers: [NewsController],
})
export class NewsModule { }