import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TagDocument = Tag & Document;

@Schema({ strict: true })
export class Tag {
  @Prop({ desc: '类型' })
  type: number;

  @Prop({ desc: '枚举' })
  tag: string;

  @Prop({ desc: '文本' })
  tagName: string;

  @Prop({ default: 0, desc: '层级' })
  level: number;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
