import { Test, TestingModule } from '@nestjs/testing';
import { BookVersionController } from './book-version.controller';

describe('BookVersionController', () => {
  let controller: BookVersionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookVersionController],
    }).compile();

    controller = module.get<BookVersionController>(BookVersionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
