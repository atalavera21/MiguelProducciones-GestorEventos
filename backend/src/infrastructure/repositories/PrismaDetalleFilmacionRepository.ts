import { type DetalleFilmacion, type CrearDetalleFilmacionDto } from '../../domain/entities/DetalleFilmacion';
import { type IDetalleFilmacionRepository } from '../../domain/repositories/IDetalleFilmacionRepository';
import prisma from '../database/prismaClient';

export class PrismaDetalleFilmacionRepository implements IDetalleFilmacionRepository {

  async findByEventoServicioId(idEventoServicio: number): Promise<DetalleFilmacion | null> {
    const detalle = await prisma.detalleFilmacion.findUnique({ where: { idEventoServicio } });
    if (!detalle) return null;
    return this.toDomain(detalle);
  }

  async create(dto: CrearDetalleFilmacionDto): Promise<DetalleFilmacion> {
    const detalle = await prisma.detalleFilmacion.create({
      data: {
        idEventoServicio: dto.idEventoServicio,
        incluyeHighlight: dto.incluyeHighlight,
        notas:            dto.notas,
      },
    });
    return this.toDomain(detalle);
  }

  async update(id: number, dto: Partial<CrearDetalleFilmacionDto>): Promise<DetalleFilmacion | null> {
    try {
      const detalle = await prisma.detalleFilmacion.update({
        where: { id },
        data: dto,
      });
      return this.toDomain(detalle);
    } catch {
      return null;
    }
  }

  private toDomain(p: {
    id: number;
    idEventoServicio: number;
    incluyeHighlight: boolean;
    notas: string | null;
  }): DetalleFilmacion {
    return {
      id:               p.id,
      idEventoServicio: p.idEventoServicio,
      incluyeHighlight: p.incluyeHighlight,
      notas:            p.notas ?? undefined,
    };
  }
}
