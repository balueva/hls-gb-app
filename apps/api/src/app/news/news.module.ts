import { Module, CacheModule } from '@nestjs/common';
import { NewsController } from './news.controller';

@Module({
    imports: [CacheModule.register()],
    controllers: [NewsController],
})
export class NewsModule { }