-- CreateEnum
CREATE TYPE "EstadoAsistencia" AS ENUM ('presente_buen_concepto', 'presente_mal_concepto', 'ausente');

-- CreateEnum
CREATE TYPE "TipoNota" AS ENUM ('TP', 'Examen', 'Final');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('pdf', 'docx');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes');

-- CreateTable
CREATE TABLE "Docente" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "proveedorAuth" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Docente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" SERIAL NOT NULL,
    "escuela" TEXT NOT NULL,
    "anio" TEXT NOT NULL,
    "materia" TEXT NOT NULL,
    "docenteId" INTEGER NOT NULL,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alumno" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "dni" TEXT,
    "contacto" TEXT,

    CONSTRAINT "Alumno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlumnoCurso" (
    "id" SERIAL NOT NULL,
    "alumnoId" INTEGER NOT NULL,
    "cursoId" INTEGER NOT NULL,

    CONSTRAINT "AlumnoCurso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asistencia" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoAsistencia" NOT NULL,
    "alumnoCursoId" INTEGER NOT NULL,

    CONSTRAINT "Asistencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nota" (
    "id" SERIAL NOT NULL,
    "tipo" "TipoNota" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "trimestre" INTEGER NOT NULL,
    "nota" DOUBLE PRECISION NOT NULL,
    "alumnoCursoId" INTEGER NOT NULL,

    CONSTRAINT "Nota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agenda" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "docenteId" INTEGER NOT NULL,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Planificacion" (
    "id" SERIAL NOT NULL,
    "tema" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "fecha" TIMESTAMP(3),
    "cursoId" INTEGER NOT NULL,

    CONSTRAINT "Planificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documento" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoDocumento" NOT NULL,
    "link" TEXT NOT NULL,
    "cursoId" INTEGER NOT NULL,

    CONSTRAINT "Documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bibliografia" (
    "id" SERIAL NOT NULL,
    "tema" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "docenteId" INTEGER NOT NULL,

    CONSTRAINT "Bibliografia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Horario" (
    "id" SERIAL NOT NULL,
    "dia" "DiaSemana" NOT NULL,
    "hora" TEXT NOT NULL,
    "descripcion" TEXT,
    "docenteId" INTEGER NOT NULL,

    CONSTRAINT "Horario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suscripcion" (
    "id" SERIAL NOT NULL,
    "estado" TEXT NOT NULL,
    "proveedor" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "docenteId" INTEGER NOT NULL,

    CONSTRAINT "Suscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Docente_email_key" ON "Docente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AlumnoCurso_alumnoId_cursoId_key" ON "AlumnoCurso"("alumnoId", "cursoId");

-- CreateIndex
CREATE UNIQUE INDEX "Suscripcion_docenteId_key" ON "Suscripcion"("docenteId");

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Docente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumnoCurso" ADD CONSTRAINT "AlumnoCurso_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumnoCurso" ADD CONSTRAINT "AlumnoCurso_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_alumnoCursoId_fkey" FOREIGN KEY ("alumnoCursoId") REFERENCES "AlumnoCurso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_alumnoCursoId_fkey" FOREIGN KEY ("alumnoCursoId") REFERENCES "AlumnoCurso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Docente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Planificacion" ADD CONSTRAINT "Planificacion_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documento" ADD CONSTRAINT "Documento_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bibliografia" ADD CONSTRAINT "Bibliografia_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Docente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horario" ADD CONSTRAINT "Horario_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Docente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suscripcion" ADD CONSTRAINT "Suscripcion_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Docente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
