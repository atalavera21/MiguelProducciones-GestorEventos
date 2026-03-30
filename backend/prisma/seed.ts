import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando seed...');

  // Limpiamos las tablas en orden correcto (primero los que tienen FK hacia los catálogos).
  // Esto permite correr el seed múltiples veces sin errores de duplicado.
  // En .NET sería: context.Database.ExecuteSqlRaw("DELETE FROM ...")
  await prisma.detalleFotografia.deleteMany();
  await prisma.detalleFilmacion.deleteMany();
  await prisma.detalleCuadroFirma.deleteMany();
  await prisma.contrato.deleteMany();
  await prisma.eventoServicio.deleteMany();
  await prisma.proforma.deleteMany();
  await prisma.evento.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.tipoEvento.deleteMany();
  await prisma.tipoServicio.deleteMany();
  await prisma.estadoContrato.deleteMany();

  console.log('Tablas limpiadas');

  // ─── Tipos de evento ──────────────────────────────────────────────────────
  // Catálogo de los tipos de celebración que cubre Miguel Producciones.
  // activo = false significa que no aparece en el formulario de nuevo evento.
  await prisma.tipoEvento.createMany({
    data: [
      { nombre: 'Boda' },
      { nombre: 'Quinceañera' },
      { nombre: 'Bautizo' },
      { nombre: 'Baby Shower' },
      { nombre: 'Cumpleaños' },
      { nombre: '50 Años' },
      { nombre: 'Sesión Fotográfica' },
      { nombre: 'Otro' },
    ],
  });

  console.log('Tipos de evento creados');

  // ─── Tipos de servicio ────────────────────────────────────────────────────
  // Los IDs quedan en este orden: 1=Fotografía, 2=Filmación, 3=Cuadro Firma.
  // ESTADOS_CONTRATO en EstadoContrato.ts depende de que estos IDs sean estables.
  await prisma.tipoServicio.createMany({
    data: [
      { nombre: 'Fotografía',   descripcion: 'Cobertura fotográfica del evento' },
      { nombre: 'Filmación',    descripcion: 'Cobertura en video del evento' },
      { nombre: 'Cuadro Firma', descripcion: 'Cuadro decorativo con firmas de invitados' },
    ],
  });

  console.log('Tipos de servicio creados');

  // ─── Estados de contrato ──────────────────────────────────────────────────
  // El orden importa — los IDs deben coincidir con ESTADOS_CONTRATO en EstadoContrato.ts:
  //   1 = Pendiente, 2 = PendienteEntrega, 3 = Terminado, 4 = Cancelado
  await prisma.estadoContrato.createMany({
    data: [
      { nombre: 'Pendiente' },
      { nombre: 'PendienteEntrega' },
      { nombre: 'Terminado' },
      { nombre: 'Cancelado' },
    ],
  });

  console.log('Estados de contrato creados');
  console.log('\nSeed completado exitosamente');
}

main()
  .catch((error) => {
    console.error('Error en el seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
