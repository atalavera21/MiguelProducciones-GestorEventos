import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

// Prisma v6 introduce el concepto de "driver adapters":
// en lugar de manejar la conexión internamente, delega esa
// responsabilidad a un adaptador externo (en nuestro caso, pg para PostgreSQL).
//
// Es similar a cuando en EF Core especificas el proveedor:
//   options.UseNpgsql(connectionString)
// Aquí lo hacemos con:
//   new PrismaPg({ connectionString })

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// Una sola instancia de PrismaClient para toda la aplicación.
// Si creamos múltiples instancias, cada una abre su propio pool
// de conexiones y agotamos los límites de Railway rápidamente.
const prisma = new PrismaClient({ adapter });

export default prisma;
