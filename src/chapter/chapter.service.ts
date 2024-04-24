import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
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

  async find(query?: Record<string, any>): Promise<ChapterDocument[]> {
    // 排除不显示字段 0 不显示  1 显示
    const exculdField = { __v: 0 };
    const isServices = query.isServices || false;
    delete query.isServices;
    const chapterIdInfoExculdField = {
      'chapterIdInfo.__v': 0,
      'chapterIdInfo.sourceId': 0,
      'bookClassifyInfo.chapterId': 0,
    };
    isServices && delete chapterIdInfoExculdField['chapterIdInfo.sourceId'];

    return this.chapterModel.aggregate([
      {
        // 查询条件
        $match: {
          ...(() => {
            return Object.keys(query).reduce((_, key) => {
              if (['bookId'].includes(key)) {
                _[key] = { $eq: new mongoose.Types.ObjectId(query[key]) };
              } else {
                new mongoose.Types.ObjectId();
              }
              return _;
            }, {});
          })(),
        },
      },
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
        $project: chapterIdInfoExculdField,
      },
    ]); // 聚合查询中进行数据关联
  }
}
