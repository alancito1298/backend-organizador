import { Test, TestingModule } from '@nestjs/testing';
import { AlumnosCursosController } from './alumnos-cursos.controller';

describe('AlumnosCursosController', () => {
  let controller: AlumnosCursosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlumnosCursosController],
    }).compile();

    controller = module.get<AlumnosCursosController>(AlumnosCursosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
