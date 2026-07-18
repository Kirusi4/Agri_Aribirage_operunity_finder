import { Test, TestingModule } from '@nestjs/testing';
import { AgriController } from './agri.controller';

describe('AgriController', () => {
  let controller: AgriController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgriController],
    }).compile();

    controller = module.get<AgriController>(AgriController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
