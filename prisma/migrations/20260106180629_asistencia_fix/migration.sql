/*
  Warnings:

  - A unique constraint covering the columns `[fecha,alumnoCursoId]` on the table `Asistencia` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Asistencia_fecha_alumnoCursoId_key" ON "Asistencia"("fecha", "alumnoCursoId");
