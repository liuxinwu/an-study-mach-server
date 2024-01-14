import { Module } from '@nestjs/common';
import { BookVersionService } from './book-version.service';
import { BookVersionController } from './book-version.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BookVersion, BookVersionSchema } from './schema/book-version.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BookVersion.name, schema: BookVersionSchema },
    ]),
  ],
  controllers: [BookVersionController],
  providers: [BookVersionService],
})
export class BookVersionModule {}
