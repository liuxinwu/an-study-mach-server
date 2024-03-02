import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterDocument } from './schema/chapter.schema';

@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Post('add')
  add(@Body() query: ChapterDocument[]): Promise<ChapterDocument[]> {
    return this.chapterService.add(query);
  }

  @Get('find')
  find(@Query() query: Record<string, any>): Promise<ChapterDocument[]> {
    const { _id } = query;
    return this.chapterService.find(_id);
  }
}
