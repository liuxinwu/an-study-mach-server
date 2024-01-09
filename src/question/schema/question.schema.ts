import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema({ strict: true })
export class Question extends Document {
  @Prop()
  question: number;

  @Prop()
  questionName: string;

  @Prop()
  content: { type: number; content: mongoose.Schema.Types.Mixed }[];

  @Prop()
  label: string;

  @Prop()
  points: { key: string; value: string }[];

  @Prop()
  options: { type: number; content: string }[][];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

// Mongoose在将数据存储到数据库之前会进行隐式转换。
// Mongoose对数据进行转换是通过定义在模式（Schema）上的字段类型和Mongoose的内置转换器来实现的。
// 在进行隐式转换时也要小心避免数据丢失或意外的结果。如果需要更精确的控制和转换逻辑，
// 你可以使用自定义的转换器或数据校验器来处理数据转换的逻辑。

// 在Mongoose中，开启严格模式后，如果数组对象中的字段没有在Schema中定义，这些字段也能够存储到数据库中。这可能会导致数据的不一致性和意外行为。
// 严格模式主要用于控制顶级文档的字段，而对于嵌套的子文档或数组对象，严格模式并不会强制执行。因此，即使开启了严格模式，未在Schema中定义的数组对象字段仍然可以存储到数据库中。
// 为了避免这种情况，建议在定义Mongoose Schema时，尽量详细地定义所有的字段，包括嵌套的子文档和数组对象。这样可以确保数据的一致性，并避免意外的数据存储行为。

// import { Document } from 'mongoose';
// import mongoose from 'mongoose';
// const { Schema } = mongoose;

// export interface QuestionDocument extends Document {
//   question: number;
//   questionName: string;
//   content: [{ type: number; content: string | object }];
// }

// export const QuestionSchema = new Schema(
//   {
//     question: Number,
//     questionName: String,
//     content: [{ type: Number, content: Schema.Types.Mixed }],
//   },
//   { strict: true },
// );