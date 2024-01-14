import { Body, Controller, Post } from '@nestjs/common';
import { BookClassifyService } from './book-classify.service';
import { BookClassifyDocument } from './schema/book-classify.schema';

@Controller('book-classify')
export class BookClassifyController {
  constructor(private readonly bookClassifyService: BookClassifyService) {}

  @Post('add')
  add(
    @Body() bookClassify: BookClassifyDocument,
  ): Promise<BookClassifyDocument> {
    return this.bookClassifyService.add(bookClassify);
  }
}
