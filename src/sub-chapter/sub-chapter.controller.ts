import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SubChapterDocument } from './schema/sub-chapter.schema';
import { SubChapterService } from './sub-chapter.service';

@Controller('sub-chapter')
export class SubChapterController {
  constructor(private subChapterService: SubChapterService) {}

  @Post('add')
  add(@Body() subChapter: SubChapterDocument[]): Promise<SubChapterDocument[]> {
    return this.subChapterService.add(subChapter);
  }

  @Get('find')
  find(@Query() query: Record<string, any>): Promise<SubChapterDocument[]> {
    const { _id } = query;
    if (!_id) return this.subChapterService.find();
    return this.subChapterService.find({ _id });
  }
}
