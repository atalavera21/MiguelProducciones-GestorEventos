import { type Evento, type CrearEventoDto, type ActualizarEventoDto, TipoEvento, EstadoEvento } from '../../domain/entities/Evento';
import { type IEventoRepository } from '../../domain/repositories/IEventoRepository';
import prisma from '../database/prismaClient';

export class PrismaEventoRepository implements IEventoRepository {

  async findAll(): Promise<Evento[]> {
    const eventos = await prisma.evento.findMany({
      orderBy: { fecha: 'asc' }, // Los próximos primero — útil para la agenda
    });
    return eventos.map(this.toDomain);
  }

  async findById(id: string): Promise<Evento | null> {
    const evento = await prisma.evento.findUnique({ where: { id } });
    if (!evento) return null;
    return this.toDomain(evento);
  }

  async findByClienteId(clienteId: string): Promise<Evento[]> {
    const eventos = await prisma.evento.findMany({
      where: { clienteId },
      orderBy: { fecha: 'asc' },
    });
    return eventos.map(this.toDomain);
  }

  async create(dto: CrearEventoDto): Promise<Evento> {
    const evento = await prisma.evento.create({
      data: {
        nombre: dto.nombre,
        fecha: dto.fecha,
        tipoEvento: dto.tipoEvento,
        notas: dto.notas,
        clienteId: dto.clienteId,
      },
    });
    return this.toDomain(evento);
  }

  async update(id: string, dto: ActualizarEventoDto): Promise<Evento | null> {
    try {
      const evento = await prisma.evento.update({
        where: { id },
        data: dto,
      });
      return this.toDomain(evento);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.evento.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  private toDomain(prismaEvento: {
    id: string;
    nombre: string;
    fecha: Date;
    tipoEvento: string;
    estado: string;
    notas: string | null;
    clienteId: string;
    creadoEn: Date;
    actualizadoEn: Date;
  }): Evento {
    return {
      id: prismaEvento.id,
      nombre: prismaEvento.nombre,
      fecha: prismaEvento.fecha,
      // Los enums de Prisma son strings internamente.
      // Hacemos un cast explícito a nuestros enums de dominio.
      tipoEvento: prismaEvento.tipoEvento as TipoEvento,
      estado: prismaEvento.estado as EstadoEvento,
      notas: prismaEvento.notas ?? undefined,
      clienteId: prismaEvento.clienteId,
      creadoEn: prismaEvento.creadoEn,
      actualizadoEn: prismaEvento.actualizadoEn,
    };
  }
}
