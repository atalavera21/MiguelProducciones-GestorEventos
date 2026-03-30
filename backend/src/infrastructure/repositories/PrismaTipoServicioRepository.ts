import { type TipoServicio } from '../../domain/entities/TipoServicio';
import { type ITipoServicioRepository } from '../../domain/repositories/ITipoServicioRepository';
import prisma from '../database/prismaClient';

export class PrismaTipoServicioRepository implements ITipoServicioRepository {

  async findAll(): Promise<TipoServicio[]> {
    const tipos = await prisma.tipoServicio.findMany({
      orderBy: { id: 'asc' },
    });
    return tipos.map(this.toDomain);
  }

  async findActivos(): Promise<TipoServicio[]> {
    const tipos = await prisma.tipoServicio.findMany({
      where: { activo: true },
      orderBy: { id: 'asc' },
    });
    return tipos.map(this.toDomain);
  }

  async findById(id: number): Promise<TipoServicio | null> {
    const tipo = await prisma.tipoServicio.findUnique({ where: { id } });
    if (!tipo) return null;
    return this.toDomain(tipo);
  }

  private toDomain(p: {
    id: number;
    nombre: string;
    descripcion: string | null;
    activo: boolean;
  }): TipoServicio {
    return {
      id:          p.id,
      nombre:      p.nombre,
      descripcion: p.descripcion ?? undefined,
      activo:      p.activo,
    };
  }
}
