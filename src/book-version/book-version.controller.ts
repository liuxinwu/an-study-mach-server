import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BookVersionService } from './book-version.service';
import { BookVersionDocument } from './schema/book-version.schema';
import { Types } from 'mongoose';

@Controller('book-version')
export class BookVersionController {
  constructor(private readonly bookVersionService: BookVersionService) {}

  @Post('add')
  add(
    @Body() bookClassify: BookVersionDocument[],
  ): Promise<BookVersionDocument[]> {
    return this.bookVersionService.add(bookClassify);
  }

  @Get('find')
  find(@Query() query: Record<string, any>): Promise<BookVersionDocument[]> {
    const { _id } = query;
    return this.bookVersionService.find(_id);
  }
}
