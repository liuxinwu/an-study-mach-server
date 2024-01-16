import { Body, Controller, Post } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterDocument } from './schema/chapter.schema';

@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Post('add')
  add(@Body() query: ChapterDocument[]): Promise<ChapterDocument[]> {
    return this.chapterService.add(query);
  }
}
