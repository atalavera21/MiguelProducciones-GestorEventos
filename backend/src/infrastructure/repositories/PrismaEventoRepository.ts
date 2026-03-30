import { type Evento, type CrearEventoDto, type ActualizarEventoDto } from '../../domain/entities/Evento';
import { type IEventoRepository } from '../../domain/repositories/IEventoRepository';
import prisma from '../database/prismaClient';

export class PrismaEventoRepository implements IEventoRepository {

  async findAll(): Promise<Evento[]> {
    const eventos = await prisma.evento.findMany({
      orderBy: { fechaHora: 'asc' }, // Los próximos primero — útil para la agenda
    });
    return eventos.map(this.toDomain);
  }

  async findById(id: number): Promise<Evento | null> {
    const evento = await prisma.evento.findUnique({ where: { id } });
    if (!evento) return null;
    return this.toDomain(evento);
  }

  async findByClienteId(idCliente: number): Promise<Evento[]> {
    const eventos = await prisma.evento.findMany({
      where: { idCliente },
      orderBy: { fechaHora: 'asc' },
    });
    return eventos.map(this.toDomain);
  }

  async create(dto: CrearEventoDto): Promise<Evento> {
    const evento = await prisma.evento.create({
      data: {
        idCliente:    dto.idCliente,
        idTipoEvento: dto.idTipoEvento,
        direccion:    dto.direccion,
        fechaHora:    dto.fechaHora,
        notas:        dto.notas,
      },
    });
    return this.toDomain(evento);
  }

  async update(id: number, dto: ActualizarEventoDto): Promise<Evento | null> {
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

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.evento.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  private toDomain(p: {
    id: number;
    idCliente: number;
    idTipoEvento: number;
    direccion: string;
    fechaHora: Date;
    notas: string | null;
  }): Evento {
    return {
      id:           p.id,
      idCliente:    p.idCliente,
      idTipoEvento: p.idTipoEvento,
      direccion:    p.direccion,
      fechaHora:    p.fechaHora,
      notas:        p.notas ?? undefined,
    };
  }
}
