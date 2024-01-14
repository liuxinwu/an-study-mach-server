import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookVersionDocument = BookVersion & Document;

@Schema({ strict: true })
export class BookVersion {
  @Prop({ desc: '名称 EName' })
  name: string;

  @Prop({ desc: '名称 EID' })
  type: number;
}

export const BookVersionSchema = SchemaFactory.createForClass(BookVersion);

BookVersionSchema.virtual('bookClassify', {
  ref: 'BookClassify',
  localField: '_id',
  foreignField: 'pId',
});
