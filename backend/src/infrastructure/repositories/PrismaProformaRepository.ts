import { type Proforma, type CrearProformaDto, type ServicioProforma } from '../../domain/entities/Proforma';
import { type IProformaRepository } from '../../domain/repositories/IProformaRepository';
import prisma from '../database/prismaClient';

export class PrismaProformaRepository implements IProformaRepository {

  async findAll(): Promise<Proforma[]> {
    const proformas = await prisma.proforma.findMany({
      orderBy: { creadoEn: 'desc' },
    });
    return proformas.map(this.toDomain);
  }

  async findById(id: number): Promise<Proforma | null> {
    const proforma = await prisma.proforma.findUnique({ where: { id } });
    if (!proforma) return null;
    return this.toDomain(proforma);
  }

  async create(dto: CrearProformaDto): Promise<Proforma> {
    const proforma = await prisma.proforma.create({
      data: {
        nombreCliente: dto.nombreCliente,
        tipoEvento:    dto.tipoEvento,
        fechaEvento:   dto.fechaEvento,
        horario:       dto.horario,
        distrito:      dto.distrito,
        referenciaDir: dto.referenciaDir,
        // servicios es JSONB — casteamos a any porque Prisma no puede inferir
        // que ServicioProforma[] es un InputJsonValue válido
        servicios:     dto.servicios as any,
        total:         dto.total,
        adelanto:      dto.adelanto,
      },
    });
    return this.toDomain(proforma);
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.proforma.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  private toDomain(p: {
    id: number;
    nombreCliente: string;
    tipoEvento: string;
    fechaEvento: Date;
    horario: string;
    distrito: string;
    referenciaDir: string | null;
    servicios: any;
    total: any;
    adelanto: any;
    creadoEn: Date;
  }): Proforma {
    return {
      id:            p.id,
      nombreCliente: p.nombreCliente,
      tipoEvento:    p.tipoEvento,
      fechaEvento:   p.fechaEvento,
      horario:       p.horario,
      distrito:      p.distrito,
      referenciaDir: p.referenciaDir ?? undefined,
      // Prisma devuelve JSONB como unknown — casteamos a nuestro tipo
      servicios:     p.servicios as ServicioProforma[],
      total:         p.total.toNumber(),
      adelanto:      p.adelanto.toNumber(),
      creadoEn:      p.creadoEn,
    };
  }
}
