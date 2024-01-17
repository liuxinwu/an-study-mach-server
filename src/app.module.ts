import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionModule } from './question/question.module';
import { BookClassifyModule } from './book-classify/book-classify.module';
import { BookVersionModule } from './book-version/book-version.module';
import { ChapterModule } from './chapter/chapter.module';
import { SubChapterModule } from './sub-chapter/sub-chapter.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/question_bank'),
    QuestionModule,
    BookClassifyModule,
    BookVersionModule,
    ChapterModule,
    SubChapterModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
