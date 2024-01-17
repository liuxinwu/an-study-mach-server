import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag, TagSchema } from './schame/tag.schame';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
