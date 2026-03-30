import { type TipoEvento } from '../../domain/entities/TipoEvento';
import { type ITipoEventoRepository } from '../../domain/repositories/ITipoEventoRepository';
import prisma from '../database/prismaClient';

export class PrismaTipoEventoRepository implements ITipoEventoRepository {

  async findAll(): Promise<TipoEvento[]> {
    const tipos = await prisma.tipoEvento.findMany({
      orderBy: { id: 'asc' },
    });
    return tipos.map(this.toDomain);
  }

  async findActivos(): Promise<TipoEvento[]> {
    const tipos = await prisma.tipoEvento.findMany({
      where: { activo: true },
      orderBy: { id: 'asc' },
    });
    return tipos.map(this.toDomain);
  }

  async findById(id: number): Promise<TipoEvento | null> {
    const tipo = await prisma.tipoEvento.findUnique({ where: { id } });
    if (!tipo) return null;
    return this.toDomain(tipo);
  }

  private toDomain(p: { id: number; nombre: string; activo: boolean }): TipoEvento {
    return { id: p.id, nombre: p.nombre, activo: p.activo };
  }
}
