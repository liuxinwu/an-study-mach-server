import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookClassifyDocument = BookClassify & Document;

@Schema({ strict: true })
export class BookClassify {
  @Prop({ desc: '版本名称枚举 EID' })
  type: string;

  @Prop({ desc: '版本名称 EName' })
  name: string;
}

export const BookClassifySchema = SchemaFactory.createForClass(BookClassify);
