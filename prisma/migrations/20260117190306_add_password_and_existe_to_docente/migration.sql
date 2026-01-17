/*
  Warnings:

  - Added the required column `password` to the `Docente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Docente" ADD COLUMN     "existe" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "password" TEXT NOT NULL;
