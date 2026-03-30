import { type DetalleFotografia, type CrearDetalleFotografiaDto, TipoPapel } from '../../domain/entities/DetalleFotografia';
import { type IDetalleFotografiaRepository } from '../../domain/repositories/IDetalleFotografiaRepository';
import prisma from '../database/prismaClient';

export class PrismaDetalleFotografiaRepository implements IDetalleFotografiaRepository {

  async findByEventoServicioId(idEventoServicio: number): Promise<DetalleFotografia | null> {
    const detalle = await prisma.detalleFotografia.findUnique({ where: { idEventoServicio } });
    if (!detalle) return null;
    return this.toDomain(detalle);
  }

  async create(dto: CrearDetalleFotografiaDto): Promise<DetalleFotografia> {
    const detalle = await prisma.detalleFotografia.create({
      data: {
        idEventoServicio: dto.idEventoServicio,
        esDigital:        dto.esDigital,
        esFisica:         dto.esFisica,
        tipoPapel:        dto.tipoPapel as any,
        notas:            dto.notas,
      },
    });
    return this.toDomain(detalle);
  }

  async update(id: number, dto: Partial<CrearDetalleFotografiaDto>): Promise<DetalleFotografia | null> {
    try {
      const detalle = await prisma.detalleFotografia.update({
        where: { id },
        data: { ...dto, tipoPapel: dto.tipoPapel as any },
      });
      return this.toDomain(detalle);
    } catch {
      return null;
    }
  }

  private toDomain(p: {
    id: number;
    idEventoServicio: number;
    esDigital: boolean;
    esFisica: boolean;
    tipoPapel: string | null;
    notas: string | null;
  }): DetalleFotografia {
    return {
      id:               p.id,
      idEventoServicio: p.idEventoServicio,
      esDigital:        p.esDigital,
      esFisica:         p.esFisica,
      tipoPapel:        p.tipoPapel as TipoPapel ?? undefined,
      notas:            p.notas ?? undefined,
    };
  }
}
