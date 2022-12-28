
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NewsDocument = HydratedDocument<News>;

@Schema()
export class News {
    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    createdAt: number;
}

export const NewsSchema = SchemaFactory.createForClass(News);
