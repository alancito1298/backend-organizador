/*
  Warnings:

  - The values [examen] on the enum `TipoEvaluacion` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TipoEvaluacion_new" AS ENUM ('trabajo_practico', 'Examen', 'final');
ALTER TABLE "Calificacion" ALTER COLUMN "tipo" TYPE "TipoEvaluacion_new" USING ("tipo"::text::"TipoEvaluacion_new");
ALTER TYPE "TipoEvaluacion" RENAME TO "TipoEvaluacion_old";
ALTER TYPE "TipoEvaluacion_new" RENAME TO "TipoEvaluacion";
DROP TYPE "public"."TipoEvaluacion_old";
COMMIT;
