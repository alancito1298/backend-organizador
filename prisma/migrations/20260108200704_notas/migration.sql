/*
  Warnings:

  - You are about to drop the `Nota` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TipoEvaluacion" AS ENUM ('trabajo_practico', 'examen', 'final');

-- DropForeignKey
ALTER TABLE "Nota" DROP CONSTRAINT "Nota_alumnoCursoId_fkey";

-- DropTable
DROP TABLE "Nota";

-- CreateTable
CREATE TABLE "Calificacion" (
    "id" SERIAL NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "trimestre" INTEGER NOT NULL,
    "tipo" "TipoEvaluacion" NOT NULL,
    "alumnoCursoId" INTEGER NOT NULL,

    CONSTRAINT "Calificacion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_alumnoCursoId_fkey" FOREIGN KEY ("alumnoCursoId") REFERENCES "AlumnoCurso"("id") ON DELETE CASCADE ON UPDATE CASCADE;
