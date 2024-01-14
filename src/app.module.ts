import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionModule } from './question/question.module';
import { BookClassifyController } from './book-classify/book-classify.controller';
import { BookClassifyModule } from './book-classify/book-classify.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/question_bank'),
    QuestionModule,
    BookClassifyModule,
  ],
  controllers: [AppController, BookClassifyController],
  providers: [AppService],
})
export class AppModule {}
