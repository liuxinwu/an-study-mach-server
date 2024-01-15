import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import {
  BookClassify,
  BookClassifyDocument,
} from './schema/book-classify.schema';

@Injectable()
export class BookClassifyService {
  constructor(
    @InjectModel(BookClassify.name)
    private bookClassifyModel: Model<BookClassifyDocument>,
  ) {}

  add(question: BookClassifyDocument[]): Promise<BookClassifyDocument[]> {
    return this.bookClassifyModel.insertMany(question);
  }

  find(_id: Schema.Types.ObjectId): Promise<BookClassifyDocument[]> {
    if (!_id) return this.bookClassifyModel.find().populate('pId').exec();
    return this.bookClassifyModel.find({ _id });
  }
}
