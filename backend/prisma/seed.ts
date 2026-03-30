import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpiamos las tablas en orden correcto (primero los que tienen FK)
  // para poder correr el seed múltiples veces sin errores de duplicado.
  // En .NET esto sería: context.Database.ExecuteSqlRaw("DELETE FROM ...")
  await prisma.contrato.deleteMany();
  await prisma.proforma.deleteMany();
  await prisma.evento.deleteMany();
  await prisma.cliente.deleteMany();

  console.log('🗑️  Tablas limpiadas');

  // ─── Clientes ───────────────────────────────────────────
  const clientes = await Promise.all([
    prisma.cliente.create({
      data: {
        nombre: 'María García López',
        telefono: '987654321',
        email: 'maria.garcia@gmail.com',
        notas: 'Clienta recurrente. Muy puntual con los pagos.',
      },
    }),
    prisma.cliente.create({
      data: {
        nombre: 'Carlos Mendoza Ríos',
        telefono: '912345678',
        notas: 'Contacto por Instagram. Busca paquete económico.',
      },
    }),
    prisma.cliente.create({
      data: {
        nombre: 'Lucía Paredes Vega',
        telefono: '956789012',
        email: 'lucia.paredes@hotmail.com',
      },
    }),
  ]);

  console.log(`✅ ${clientes.length} clientes creados`);

  // ─── Eventos ─────────────────────────────────────────────
  const [maria, carlos, lucia] = clientes;

  const eventos = await Promise.all([
    // Evento pasado — debería estar COMPLETADO
    prisma.evento.create({
      data: {
        nombre: 'Boda García - Torres',
        fecha: new Date('2026-01-15T15:00:00'),
        tipoEvento: 'BODA',
        estado: 'COMPLETADO',
        clienteId: maria.id,
        notas: 'Ceremonia en la Iglesia San Pedro. Recepción en Club Regatas.',
      },
    }),
    // Evento próximo — PENDIENTE
    prisma.evento.create({
      data: {
        nombre: 'Quinceañera Mendoza',
        fecha: new Date('2026-04-20T18:00:00'),
        tipoEvento: 'QUINCEANERA',
        estado: 'PENDIENTE',
        clienteId: carlos.id,
        notas: 'Salón Los Jardines de Miraflores. 200 invitados aprox.',
      },
    }),
    // Evento realizado — EN_ENTREGA (esperando el producto)
    prisma.evento.create({
      data: {
        nombre: 'Bautizo Paredes',
        fecha: new Date('2026-03-10T11:00:00'),
        tipoEvento: 'BAUTIZO',
        estado: 'EN_ENTREGA',
        clienteId: lucia.id,
      },
    }),
    // Otro evento de María — PENDIENTE
    prisma.evento.create({
      data: {
        nombre: 'Baby Shower García',
        fecha: new Date('2026-05-03T16:00:00'),
        tipoEvento: 'BABY_SHOWER',
        estado: 'PENDIENTE',
        clienteId: maria.id,
      },
    }),
  ]);

  console.log(`✅ ${eventos.length} eventos creados`);

  // ─── Proformas ───────────────────────────────────────────
  const [bodaGarcia, quinceMendoza, bautizoPared, babyGarcia] = eventos;

  const proformas = await Promise.all([
    prisma.proforma.create({
      data: {
        montoTotal: 3500.00,
        descripcion: 'Paquete boda completo: fotografía + video. 10 horas de cobertura. 300 fotos editadas + video highlight 5 min.',
        eventoId: bodaGarcia.id,
      },
    }),
    prisma.proforma.create({
      data: {
        montoTotal: 1800.00,
        descripcion: 'Paquete quinceañera: fotografía + video. 8 horas. 200 fotos editadas + video completo.',
        eventoId: quinceMendoza.id,
      },
    }),
    prisma.proforma.create({
      data: {
        montoTotal: 900.00,
        descripcion: 'Paquete bautizo: fotografía. 4 horas. 100 fotos editadas.',
        eventoId: bautizoPared.id,
      },
    }),
    prisma.proforma.create({
      data: {
        montoTotal: 650.00,
        descripcion: 'Sesión baby shower: fotografía. 3 horas. 80 fotos editadas.',
        eventoId: babyGarcia.id,
      },
    }),
  ]);

  console.log(`✅ ${proformas.length} proformas creadas`);

  // ─── Contratos ────────────────────────────────────────────
  const [profBoda, profQuince, profBautizo] = proformas;

  const contratos = await Promise.all([
    // Boda confirmada y firmada
    prisma.contrato.create({
      data: {
        estado: 'FIRMADO',
        montoTotal: 3500.00,
        montoAdelanto: 1000.00,
        tiempoCobertura: '10 horas',
        fotosIncluidas: 300,
        condiciones: 'El saldo restante (S/ 2,500) se abona el día del evento antes del inicio.',
        eventoId: bodaGarcia.id,
        proformaId: profBoda.id,
      },
    }),
    // Quinceañera en borrador
    prisma.contrato.create({
      data: {
        estado: 'BORRADOR',
        montoTotal: 1800.00,
        montoAdelanto: 500.00,
        tiempoCobertura: '8 horas',
        fotosIncluidas: 200,
        eventoId: quinceMendoza.id,
        proformaId: profQuince.id,
      },
    }),
    // Bautizo enviado al cliente
    prisma.contrato.create({
      data: {
        estado: 'ENVIADO',
        montoTotal: 900.00,
        montoAdelanto: 300.00,
        tiempoCobertura: '4 horas',
        fotosIncluidas: 100,
        condiciones: 'Entrega de fotos en 15 días hábiles.',
        eventoId: bautizoPared.id,
        proformaId: profBautizo.id,
      },
    }),
  ]);

  console.log(`✅ ${contratos.length} contratos creados`);
  console.log('\n🎉 Seed completado exitosamente');
}

main()
  .catch((error) => {
    console.error('❌ Error en el seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
