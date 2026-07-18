import { Test, TestingModule } from '@nestjs/testing';
import { AgriService } from './agri.service';

describe('AgriService', () => {
  let service: AgriService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgriService],
    }).compile();

    service = module.get<AgriService>(AgriService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
