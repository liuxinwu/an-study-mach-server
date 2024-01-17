import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema({ strict: true })
export class Question extends Document {
  @Prop({ required: true, dess: '课本id' })
  bookId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, dess: '章节id' })
  chapterId: mongoose.Schema.Types.ObjectId;

  @Prop({ reqired: true, desc: '数据来源的数据id 防重复' })
  sourceId: string;

  @Prop({ required: true, desc: '题目类型' })
  question: number;

  @Prop({ required: true, desc: '题目名称' })
  questionName: string;

  @Prop({ required: true, desc: '题目内容' })
  content: { type: number; content: mongoose.Schema.Types.Mixed }[];

  @Prop({ default: '', desc: '题目标签' })
  label: string;

  @Prop({ default: [], desc: '选项' })
  options: { type: number; content: string }[][];

  @Prop({ default: [], desc: '考点' })
  points: { key: string; value: string }[];

  @Prop({ defalt: [], desc: '解题模型/方法 Topics' })
  topics: mongoose.Schema.Types.ObjectId[];

  @Prop({ default: false, desc: '是否vip题目' })
  vip: boolean;

  @Prop({ default: 0, desc: '价格' })
  price: number;

  @Prop({ default: 0, desc: '活动价格' })
  activityPrice: number;

  @Prop({ desc: '答案' })
  answers: string[];

  @Prop({ default: 0, desc: '收藏数' })
  favCount: number;

  @Prop({ default: 0, desc: '查看数' })
  viewCount: number;

  @Prop({ default: 0, desc: '下载数' })
  downCount: number;

  @Prop({
    default: null,
    desc: '难度系数 难度系数(系数值区间为0~1)”反映试题的难易程度。系数值越大，试题就越容易；系数值越小，试题难度越大',
  })
  degree: number;

  @Prop({
    default: 0,
    desc: '真题次数”指试题在大型考试中出现的次数。次数越多，试题常考指数越高；次数越少，试题常考指数越低。',
  })
  realCount: number;

  @Prop({
    default: 0,
    desc: '组卷次数”指试题在用户组卷过程中被使用的次数。次数越多，试题热度越高；次数越少，试题热度越低。',
  })
  paperCount: number;

  @Prop({ desc: '更新时间' })
  date: string;
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
