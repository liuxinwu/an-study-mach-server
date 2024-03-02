import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
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

  async find(_id?: Schema.Types.ObjectId): Promise<ChapterDocument[]> {
    // 排除不显示字段 0 不显示  1 显示
    const exculdField = { __v: 0 };
    if (!_id)
      return this.chapterModel.aggregate([
        {
          $project: exculdField,
        },
        {
          $lookup: {
            from: 'subchapters', // 离谱集合名一定要按照数据库的表来, 注意 mongodb 对集合名的转换
            localField: '_id',
            foreignField: 'chapterId',
            as: 'chapterIdInfo',
          },
        },
        {
          $project: {
            'chapterIdInfo.__v': 0,
            'chapterIdInfo.sourceId': 0,
            'bookClassifyInfo.chapterId': 0,
          },
        },
      ]); // 聚合查询中进行数据关联
    return this.chapterModel.find({ _id }, exculdField);
  }
}
