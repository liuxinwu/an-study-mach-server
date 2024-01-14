import { Injectable } from '@nestjs/common';
import { BookVersion, BookVersionDocument } from './schema/book-version.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class BookVersionService {
  constructor(
    @InjectModel(BookVersion.name)
    private bookVersionModel: Model<BookVersionDocument>,
  ) {}

  add(question: BookVersionDocument[]): Promise<BookVersionDocument[]> {
    return this.bookVersionModel.insertMany(question);
  }

  find(_id?: Types.ObjectId): Promise<BookVersionDocument[]> {
    if (!_id)
      return this.bookVersionModel.find().populate('bookClassify').exec();
    return this.bookVersionModel.find({ _id });
  }
}
