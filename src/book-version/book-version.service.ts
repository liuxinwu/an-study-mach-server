import { Injectable } from '@nestjs/common';
import { BookVersion, BookVersionDocument } from './schema/book-version.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';

@Injectable()
export class BookVersionService {
  constructor(
    @InjectModel(BookVersion.name)
    private bookVersionModel: Model<BookVersionDocument>,
  ) {}

  add(question: BookVersionDocument[]): Promise<BookVersionDocument[]> {
    return this.bookVersionModel.insertMany(question);
  }

  async find(_id?: Schema.Types.ObjectId): Promise<BookVersionDocument[]> {
    if (!_id)
      return this.bookVersionModel.aggregate([
        {
          $lookup: {
            from: 'bookclassifies', // 离谱集合名一定要按照数据库的表来, 注意 mongodb 对集合名的转换
            localField: '_id',
            foreignField: 'pId',
            as: 'bookClassifyInfo',
          },
        },
      ]); // 聚合查询中进行数据关联
    return this.bookVersionModel.find({ _id });
  }
}
