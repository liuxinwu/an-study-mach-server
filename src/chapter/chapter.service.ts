import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chapter, ChapterDocument } from './schema/chapter.schema';

@Injectable()
export class ChapterService {
  constructor(
    @InjectModel(Chapter.name)
    private chapterModel: Model<ChapterDocument>,
  ) {}

  add(query: ChapterDocument[]): Promise<ChapterDocument[]> {
    return this.chapterModel.insertMany(query);
  }
}
