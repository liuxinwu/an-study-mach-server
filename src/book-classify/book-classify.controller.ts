import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BookClassifyService } from './book-classify.service';
import { BookClassifyDocument } from './schema/book-classify.schema';

@Controller('book-classify')
export class BookClassifyController {
  constructor(private readonly bookClassifyService: BookClassifyService) {}

  @Post('add')
  add(
    @Body() bookClassify: BookClassifyDocument[],
  ): Promise<BookClassifyDocument[]> {
    return this.bookClassifyService.add(bookClassify);
  }

  @Get('find')
  find(@Query() query: Record<string, any>): Promise<BookClassifyDocument[]> {
    const { _id } = query;
    return this.bookClassifyService.find(_id);
  }
}
