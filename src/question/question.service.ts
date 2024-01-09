import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuestionDocument } from './schema/question.schema';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel('Question') private questionModel: Model<QuestionDocument>,
  ) {}

  add(question: QuestionDocument[]) {
    return this.questionModel.insertMany(question);
  }
}
