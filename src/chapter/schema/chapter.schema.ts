import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ChapterDocument = Chapter & Document;

@Schema({ strict: true })
export class Chapter {
  @Prop({ desc: '章节名称 DotName' })
  chapterName: string;

  @Prop({ ref: 'BookClassify', desc: '书id 来自 book-version 表' })
  bookId: mongoose.Schema.Types.ObjectId;

  @Prop({ unique: true, desc: '数据源数据id ID' })
  sourceId: string;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
