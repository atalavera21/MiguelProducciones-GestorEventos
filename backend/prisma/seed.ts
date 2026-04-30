import 'dotenv/config';
import bcrypt from 'bcrypt';
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
  await prisma.usuario.deleteMany();

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

  // ─── Usuarios del sistema ─────────────────────────────────────────────────
  // Sin registro público — los usuarios se crean aquí.
  // Las contraseñas vienen de variables de entorno para no hardcodearlas.
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const duenoPassword = process.env.SEED_DUENO_PASSWORD;
  const demoPassword  = process.env.SEED_DEMO_PASSWORD;

  if (!adminPassword || !duenoPassword || !demoPassword) {
    throw new Error(
      'Faltan variables de entorno: SEED_ADMIN_PASSWORD, SEED_DUENO_PASSWORD, SEED_DEMO_PASSWORD'
    );
  }

  const BCRYPT_ROUNDS = 12;

  const usuarios = [
    {
      alias: 'adrian',
      email: 'admin@gestoreventos.local',
      nombre: 'Adrián Talavera',
      rol: 'ADMIN' as const,
      password: adminPassword,
    },
    {
      alias: 'miguel',
      email: 'dueno@gestoreventos.local',
      nombre: 'Miguel Talavera',
      rol: 'DUENO' as const,
      password: duenoPassword,
    },
    {
      alias: 'demo',
      email: 'demo@gestoreventos.local',
      nombre: 'Usuario Demo',
      descripcion: 'Cuenta de demostración — solo visualización',
      rol: 'VIEWER' as const,
      password: demoPassword,
    },
  ];

  for (const u of usuarios) {
    const passwordHash = await bcrypt.hash(u.password, BCRYPT_ROUNDS);
    await prisma.usuario.create({
      data: {
        alias: u.alias,
        email: u.email,
        nombre: u.nombre,
        descripcion: u.descripcion,
        rol: u.rol,
        passwordHash,
      },
    });
    console.log(`Usuario creado: ${u.alias} (${u.rol})`);
  }

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
