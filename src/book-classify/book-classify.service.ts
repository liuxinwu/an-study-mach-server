import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookClassifyDocument } from './schema/book-classify.schema';

@Injectable()
export class BookClassifyService {
  constructor(
    @InjectModel('BookClassify')
    private bookClassifyModel: Model<BookClassifyDocument>,
  ) {}

  add(question: BookClassifyDocument[]) {
    return this.bookClassifyModel.insertMany(question);
  }
}
