import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './schema/question.schema';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  add(question: QuestionDocument[]) {
    return this.questionModel.insertMany(question);
  }

  find(query: Record<string, any>): Promise<QuestionDocument[]> {
    return this.questionModel.find(query);
  }
}
