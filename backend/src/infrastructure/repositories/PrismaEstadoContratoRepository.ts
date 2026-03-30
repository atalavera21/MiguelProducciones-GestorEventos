import { type EstadoContrato } from '../../domain/entities/EstadoContrato';
import { type IEstadoContratoRepository } from '../../domain/repositories/IEstadoContratoRepository';
import prisma from '../database/prismaClient';

export class PrismaEstadoContratoRepository implements IEstadoContratoRepository {

  async findAll(): Promise<EstadoContrato[]> {
    const estados = await prisma.estadoContrato.findMany({
      orderBy: { id: 'asc' },
    });
    return estados.map(this.toDomain);
  }

  async findById(id: number): Promise<EstadoContrato | null> {
    const estado = await prisma.estadoContrato.findUnique({ where: { id } });
    if (!estado) return null;
    return this.toDomain(estado);
  }

  private toDomain(p: { id: number; nombre: string }): EstadoContrato {
    return { id: p.id, nombre: p.nombre };
  }
}
