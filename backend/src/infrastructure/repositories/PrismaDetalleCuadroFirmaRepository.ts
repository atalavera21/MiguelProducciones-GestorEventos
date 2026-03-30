import { type DetalleCuadroFirma, type CrearDetalleCuadroFirmaDto } from '../../domain/entities/DetalleCuadroFirma';
import { type IDetalleCuadroFirmaRepository } from '../../domain/repositories/IDetalleCuadroFirmaRepository';
import prisma from '../database/prismaClient';

export class PrismaDetalleCuadroFirmaRepository implements IDetalleCuadroFirmaRepository {

  async findByEventoServicioId(idEventoServicio: number): Promise<DetalleCuadroFirma | null> {
    const detalle = await prisma.detalleCuadroFirma.findUnique({ where: { idEventoServicio } });
    if (!detalle) return null;
    return this.toDomain(detalle);
  }

  async create(dto: CrearDetalleCuadroFirmaDto): Promise<DetalleCuadroFirma> {
    const detalle = await prisma.detalleCuadroFirma.create({
      data: {
        idEventoServicio: dto.idEventoServicio,
        descripcion:      dto.descripcion,
      },
    });
    return this.toDomain(detalle);
  }

  async update(id: number, dto: Partial<CrearDetalleCuadroFirmaDto>): Promise<DetalleCuadroFirma | null> {
    try {
      const detalle = await prisma.detalleCuadroFirma.update({
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
    descripcion: string;
  }): DetalleCuadroFirma {
    return {
      id:               p.id,
      idEventoServicio: p.idEventoServicio,
      descripcion:      p.descripcion,
    };
  }
}
