import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type BookClassifyDocument = BookClassify & Document;

@Schema({ strict: true })
export class BookClassify {
  @Prop({ desc: '年级名 GName' })
  gradeName: string;

  @Prop({ unique: true, desc: '年级名称枚举 GID' })
  gradeType: number;

  @Prop({ desc: '学期 TName' })
  tName: string;

  @Prop({ desc: '学期 TID' })
  tId: number;

  @Prop({ desc: '数据来源的数据id BID' })
  sourceId: string;

  @Prop({ ref: 'BookVersion', desc: '版本id 自定义 来自 book-version 表' })
  pId: mongoose.Schema.Types.ObjectId;
}

export const BookClassifySchema = SchemaFactory.createForClass(BookClassify);
