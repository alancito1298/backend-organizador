import { Test, TestingModule } from '@nestjs/testing';
import { BibliografiaService } from './bibliografia.service';

describe('BibliografiaService', () => {
  let service: BibliografiaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BibliografiaService],
    }).compile();

    service = module.get<BibliografiaService>(BibliografiaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
