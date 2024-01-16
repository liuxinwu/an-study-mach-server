import { Test, TestingModule } from '@nestjs/testing';
import { SubChapterController } from './sub-chapter.controller';

describe('SubChapterController', () => {
  let controller: SubChapterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubChapterController],
    }).compile();

    controller = module.get<SubChapterController>(SubChapterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
