import { type EventoServicio, type CrearEventoServicioDto } from '../../domain/entities/EventoServicio';
import { type IEventoServicioRepository } from '../../domain/repositories/IEventoServicioRepository';
import prisma from '../database/prismaClient';

export class PrismaEventoServicioRepository implements IEventoServicioRepository {

  async findById(id: number): Promise<EventoServicio | null> {
    const es = await prisma.eventoServicio.findUnique({ where: { id } });
    if (!es) return null;
    return this.toDomain(es);
  }

  async findByEventoId(idEvento: number): Promise<EventoServicio[]> {
    const servicios = await prisma.eventoServicio.findMany({
      where: { idEvento },
      orderBy: { idTipoServicio: 'asc' },
    });
    return servicios.map(this.toDomain);
  }

  async create(dto: CrearEventoServicioDto): Promise<EventoServicio> {
    const es = await prisma.eventoServicio.create({
      data: {
        idEvento:       dto.idEvento,
        idTipoServicio: dto.idTipoServicio,
        precio:         dto.precio,
      },
    });
    return this.toDomain(es);
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.eventoServicio.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  private toDomain(p: {
    id: number;
    idEvento: number;
    idTipoServicio: number;
    precio: any;
  }): EventoServicio {
    return {
      id:             p.id,
      idEvento:       p.idEvento,
      idTipoServicio: p.idTipoServicio,
      precio:         p.precio.toNumber(),
    };
  }
}
