import { Test, TestingModule } from '@nestjs/testing';
import { AlumnosCursosService } from './alumnos-cursos.service';

describe('AlumnosCursosService', () => {
  let service: AlumnosCursosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlumnosCursosService],
    }).compile();

    service = module.get<AlumnosCursosService>(AlumnosCursosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
