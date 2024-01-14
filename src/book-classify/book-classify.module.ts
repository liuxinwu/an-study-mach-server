import { Module } from '@nestjs/common';
import { BookClassifyService } from './book-classify.service';
import { BookClassifyController } from './book-classify.controller';

@Module({
  providers: [BookClassifyService],
  controllers: [BookClassifyController],
})
export class BookClassifyModule {}
