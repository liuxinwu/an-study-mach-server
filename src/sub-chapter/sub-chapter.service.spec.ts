import { Test, TestingModule } from '@nestjs/testing';
import { SubChapterService } from './sub-chapter.service';

describe('SubChapterService', () => {
  let service: SubChapterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubChapterService],
    }).compile();

    service = module.get<SubChapterService>(SubChapterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
