import { Injectable, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './schema/question.schema';
import { shuffleArray } from 'src/utils/util';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  add(question: QuestionDocument[]) {
    return this.questionModel.insertMany(question);
  }

  async find(
    query: Record<string, any>,
    limit = 15,
  ): Promise<QuestionDocument[]> {
    // 异步调用 questionModel 的 countDocuments 方法，统计符合查询条件的文档数量
    const count = await this.questionModel.countDocuments(query);

    let page = parseInt(String(Math.random() * Math.ceil(count / limit))) - 2;
    page = page < 1 ? 1 : page;
    const document = await this.questionModel
      .find(query)
      .limit(limit * 3)
      .skip((page - 1) * limit);

    // 返回符合查询条件的文档列表
    return shuffleArray<QuestionDocument>(document).slice(0, limit);
  }
}
