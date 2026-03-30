-- CreateEnum
CREATE TYPE "rango_edad" AS ENUM ('18-30', '30-45', '45+');

-- CreateEnum
CREATE TYPE "tipo_papel" AS ENUM ('BRILLO', 'MATE');

-- CreateEnum
CREATE TYPE "metodo_pago" AS ENUM ('EFECTIVO', 'YAPE', 'TRANSFERENCIA');

-- CreateTable
CREATE TABLE "tipos_evento" (
    "id" SMALLSERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tipos_evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_servicio" (
    "id" SMALLSERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(200),
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tipos_servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estados_contrato" (
    "id" SMALLSERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,

    CONSTRAINT "estados_contrato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "telefono" VARCHAR(30) NOT NULL,
    "dni" VARCHAR(12) NOT NULL,
    "referencia" VARCHAR(200),
    "sexo" BOOLEAN NOT NULL,
    "rangoEdad" "rango_edad" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos" (
    "id" SERIAL NOT NULL,
    "idCliente" INTEGER NOT NULL,
    "idTipoEvento" SMALLINT NOT NULL,
    "direccion" VARCHAR(300) NOT NULL,
    "fechaHora" TIMESTAMP(3) NOT NULL,
    "notas" TEXT,

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evento_servicios" (
    "id" SERIAL NOT NULL,
    "idEvento" INTEGER NOT NULL,
    "idTipoServicio" SMALLINT NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "evento_servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_fotografia" (
    "id" SERIAL NOT NULL,
    "idEventoServicio" INTEGER NOT NULL,
    "esDigital" BOOLEAN NOT NULL DEFAULT true,
    "esFisica" BOOLEAN NOT NULL DEFAULT false,
    "tipoPapel" "tipo_papel",
    "notas" VARCHAR(300),

    CONSTRAINT "detalle_fotografia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_filmacion" (
    "id" SERIAL NOT NULL,
    "idEventoServicio" INTEGER NOT NULL,
    "incluyeHighlight" BOOLEAN NOT NULL DEFAULT true,
    "notas" VARCHAR(300),

    CONSTRAINT "detalle_filmacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_cuadrofirma" (
    "id" SERIAL NOT NULL,
    "idEventoServicio" INTEGER NOT NULL,
    "descripcion" VARCHAR(300) NOT NULL,

    CONSTRAINT "detalle_cuadrofirma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contratos" (
    "id" SERIAL NOT NULL,
    "idEvento" INTEGER NOT NULL,
    "idEstado" SMALLINT NOT NULL,
    "nombreCliente" VARCHAR(150) NOT NULL,
    "dniCliente" VARCHAR(12) NOT NULL,
    "telefonoCliente" VARCHAR(30) NOT NULL,
    "tipoEvento" VARCHAR(100) NOT NULL,
    "direccionEvento" VARCHAR(300) NOT NULL,
    "fechaHoraEvento" TIMESTAMP(3) NOT NULL,
    "montoTotal" DECIMAL(10,2) NOT NULL,
    "montoAdelanto" DECIMAL(10,2) NOT NULL,
    "saldo" DECIMAL(10,2) NOT NULL,
    "metodoPago" "metodo_pago" NOT NULL,
    "cuentaPago" VARCHAR(100) NOT NULL,
    "dniFotografo" VARCHAR(12) NOT NULL,
    "fechaContrato" DATE NOT NULL,
    "pdfUrl" VARCHAR(500),

    CONSTRAINT "contratos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proformas" (
    "id" SERIAL NOT NULL,
    "nombreCliente" VARCHAR(150) NOT NULL,
    "tipoEvento" VARCHAR(100) NOT NULL,
    "fechaEvento" DATE NOT NULL,
    "horario" VARCHAR(50) NOT NULL,
    "distrito" VARCHAR(100) NOT NULL,
    "referenciaDir" VARCHAR(200),
    "servicios" JSONB NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "adelanto" DECIMAL(10,2) NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proformas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "detalle_fotografia_idEventoServicio_key" ON "detalle_fotografia"("idEventoServicio");

-- CreateIndex
CREATE UNIQUE INDEX "detalle_filmacion_idEventoServicio_key" ON "detalle_filmacion"("idEventoServicio");

-- CreateIndex
CREATE UNIQUE INDEX "detalle_cuadrofirma_idEventoServicio_key" ON "detalle_cuadrofirma"("idEventoServicio");

-- CreateIndex
CREATE UNIQUE INDEX "contratos_idEvento_key" ON "contratos"("idEvento");

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_idTipoEvento_fkey" FOREIGN KEY ("idTipoEvento") REFERENCES "tipos_evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento_servicios" ADD CONSTRAINT "evento_servicios_idEvento_fkey" FOREIGN KEY ("idEvento") REFERENCES "eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento_servicios" ADD CONSTRAINT "evento_servicios_idTipoServicio_fkey" FOREIGN KEY ("idTipoServicio") REFERENCES "tipos_servicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_fotografia" ADD CONSTRAINT "detalle_fotografia_idEventoServicio_fkey" FOREIGN KEY ("idEventoServicio") REFERENCES "evento_servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_filmacion" ADD CONSTRAINT "detalle_filmacion_idEventoServicio_fkey" FOREIGN KEY ("idEventoServicio") REFERENCES "evento_servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_cuadrofirma" ADD CONSTRAINT "detalle_cuadrofirma_idEventoServicio_fkey" FOREIGN KEY ("idEventoServicio") REFERENCES "evento_servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_idEvento_fkey" FOREIGN KEY ("idEvento") REFERENCES "eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_idEstado_fkey" FOREIGN KEY ("idEstado") REFERENCES "estados_contrato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
