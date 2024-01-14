import { Controller, Post, Body } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionDocument } from './schema/question.schema';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('add')
  add(@Body() question: QuestionDocument[]): Promise<QuestionDocument[]> {
    return this.questionService.add(question);
  }
}
