-- CreateEnum
CREATE TYPE "TipoEvento" AS ENUM ('BODA', 'QUINCEANERA', 'BAUTIZO', 'BABY_SHOWER', 'CUMPLEANOS', 'SESION_FOTOGRAFICA', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoEvento" AS ENUM ('PENDIENTE', 'EN_ENTREGA', 'COMPLETADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EstadoContrato" AS ENUM ('BORRADOR', 'ENVIADO', 'FIRMADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "notas" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "tipoEvento" "TipoEvento" NOT NULL,
    "estado" "EstadoEvento" NOT NULL DEFAULT 'PENDIENTE',
    "notas" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,
    "clienteId" TEXT NOT NULL,

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proformas" (
    "id" TEXT NOT NULL,
    "montoTotal" DECIMAL(10,2) NOT NULL,
    "descripcion" TEXT,
    "notas" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventoId" TEXT NOT NULL,

    CONSTRAINT "proformas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contratos" (
    "id" TEXT NOT NULL,
    "estado" "EstadoContrato" NOT NULL DEFAULT 'BORRADOR',
    "montoTotal" DECIMAL(10,2) NOT NULL,
    "montoAdelanto" DECIMAL(10,2) NOT NULL,
    "tiempoCobertura" TEXT NOT NULL,
    "fotosIncluidas" INTEGER NOT NULL,
    "condiciones" TEXT,
    "pdfUrl" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,
    "eventoId" TEXT NOT NULL,
    "proformaId" TEXT,

    CONSTRAINT "contratos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contratos_proformaId_key" ON "contratos"("proformaId");

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proformas" ADD CONSTRAINT "proformas_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_proformaId_fkey" FOREIGN KEY ("proformaId") REFERENCES "proformas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
