import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubChapter, SubChapterSchema } from './schema/sub-chapter.schema';
import { SubChapterController } from './sub-chapter.controller';
import { SubChapterService } from './sub-chapter.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubChapter.name, schema: SubChapterSchema },
    ]),
  ],
  controllers: [SubChapterController],
  providers: [SubChapterService],
})
export class SubChapterModule {}
