import { Module } from '@nestjs/common';
import { BookClassifyService } from './book-classify.service';
import { BookClassifyController } from './book-classify.controller';
import {
  BookClassify,
  BookClassifySchema,
} from './schema/book-classify.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BookClassify.name, schema: BookClassifySchema },
    ]),
  ],
  providers: [BookClassifyService],
  controllers: [BookClassifyController],
})
export class BookClassifyModule {}
