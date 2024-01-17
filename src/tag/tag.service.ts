import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TagDocument } from './schame/tag.schame';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag.name)
    private tagModel: Model<TagDocument>,
  ) {}

  add(tag: TagDocument[]): Promise<TagDocument[]> {
    return this.tagModel.insertMany(tag);
  }

  find(query?: Record<string, any>): Promise<TagDocument[]> {
    return this.tagModel.find(query);
  }
}
