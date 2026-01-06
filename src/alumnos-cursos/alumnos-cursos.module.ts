import { Module } from '@nestjs/common';
import { AlumnosCursosService } from './alumnos-cursos.service';
import { AlumnosCursosController } from './alumnos-cursos.controller';

@Module({
  controllers: [AlumnosCursosController],
  providers: [AlumnosCursosService],
})
export class AlumnosCursosModule {}
