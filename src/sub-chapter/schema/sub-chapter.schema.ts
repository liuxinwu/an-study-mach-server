import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type SubChapterDocument = SubChapter & Document;

@Schema({ strict: true })
export class SubChapter {
  @Prop({ desc: '名称 Name' })
  name: string;

  @Prop({ ref: 'BookClassify', desc: '书id 来自 book-version 表' })
  bookId: mongoose.Schema.Types.ObjectId;

  @Prop({ ref: 'Chapter', desc: '章节id 来自 chapter 表' })
  chapterId: mongoose.Schema.Types.ObjectId;

  @Prop({ unique: true, desc: '数据源数据id ID' })
  sourceId: string;

  @Prop({ ref: 'Point', desc: '知识点 Points' })
  points: mongoose.Schema.Types.ObjectId[];
}

export const SubChapterSchema = SchemaFactory.createForClass(SubChapter);
