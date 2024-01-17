import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TagDocument } from './schame/tag.schame';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @Post('add')
  add(@Body() tag: TagDocument[]): Promise<TagDocument[]> {
    return this.tagService.add(tag);
  }

  @Get('find')
  find(@Query() query: Record<string, any>): Promise<TagDocument[]> {
    const { _id } = query;
    if (!_id) return this.tagService.find();
    this.tagService.find({ _id });
  }
}
