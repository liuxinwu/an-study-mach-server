import { Test, TestingModule } from '@nestjs/testing';
import { BookClassifyService } from './book-classify.service';

describe('BookClassifyService', () => {
  let service: BookClassifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookClassifyService],
    }).compile();

    service = module.get<BookClassifyService>(BookClassifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
