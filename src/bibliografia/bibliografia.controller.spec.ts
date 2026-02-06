import { Test, TestingModule } from '@nestjs/testing';
import { BibliografiaController } from './bibliografia.controller';

describe('BibliografiaController', () => {
  let controller: BibliografiaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BibliografiaController],
    }).compile();

    controller = module.get<BibliografiaController>(BibliografiaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
