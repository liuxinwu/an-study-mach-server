import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubChapter, SubChapterDocument } from './schema/sub-chapter.schema';

@Injectable()
export class SubChapterService {
  constructor(
    @InjectModel(SubChapter.name)
    private subChapterModel: Model<SubChapterDocument>,
  ) {}

  add(subChapter: SubChapterDocument[]): Promise<SubChapterDocument[]> {
    return this.subChapterModel.insertMany(subChapter);
  }

  find(query?: Record<string, any>): Promise<SubChapterDocument[]> {
    return this.subChapterModel.find(query);
  }
}
