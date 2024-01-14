import { Test, TestingModule } from '@nestjs/testing';
import { BookClassifyController } from './book-classify.controller';

describe('BookClassifyController', () => {
  let controller: BookClassifyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookClassifyController],
    }).compile();

    controller = module.get<BookClassifyController>(BookClassifyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
