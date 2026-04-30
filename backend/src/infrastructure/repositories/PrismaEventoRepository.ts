import { type Evento, type EventoResumen, type CrearEventoDto, type ActualizarEventoDto } from '../../domain/entities/Evento';
import { type IEventoRepository } from '../../domain/repositories/IEventoRepository';
import prisma from '../database/prismaClient';

export class PrismaEventoRepository implements IEventoRepository {

  async findAll(): Promise<EventoResumen[]> {
    // Incluye cliente y tipo de evento para evitar N+1 en el frontend (agenda/calendario)
    const eventos = await prisma.evento.findMany({
      where: { activo: true },
      include: {
        cliente:    { select: { nombre: true } },
        tipoEvento: { select: { nombre: true } },
      },
      orderBy: { fechaHora: 'asc' },
    });
    return eventos.map(e => ({
      ...this.toDomain(e),
      nombreCliente:    e.cliente.nombre,
      nombreTipoEvento: e.tipoEvento.nombre,
    }));
  }

  async findById(id: number): Promise<Evento | null> {
    // Permitimos consultar eventos archivados por ID (para auditoría/historial)
    const evento = await prisma.evento.findUnique({ where: { id } });
    if (!evento) return null;
    return this.toDomain(evento);
  }

  async findByClienteId(idCliente: number): Promise<Evento[]> {
    const eventos = await prisma.evento.findMany({
      where: { idCliente, activo: true },
      orderBy: { fechaHora: 'asc' },
    });
    return eventos.map(this.toDomain);
  }

  async create(dto: CrearEventoDto): Promise<Evento> {
    // Transacción: el evento y sus servicios se crean o fallan juntos
    const evento = await prisma.$transaction(async (tx) => {
      const ev = await tx.evento.create({
        data: {
          idCliente:    dto.idCliente,
          idTipoEvento: dto.idTipoEvento,
          direccion:    dto.direccion,
          fechaHora:    dto.fechaHora,
          notas:        dto.notas,
        },
      });

      for (const servicio of dto.servicios ?? []) {
        const es = await tx.eventoServicio.create({
          data: {
            idEvento:       ev.id,
            idTipoServicio: servicio.idTipoServicio,
            precio:         servicio.precio,
          },
        });

        if (servicio.detalleFotografia) {
          await tx.detalleFotografia.create({
            data: {
              idEventoServicio: es.id,
              esDigital:        servicio.detalleFotografia.esDigital,
              esFisica:         servicio.detalleFotografia.esFisica,
              tipoPapel:        servicio.detalleFotografia.tipoPapel ?? null,
              notas:            servicio.detalleFotografia.notas ?? null,
            },
          });
        }

        if (servicio.detalleFilmacion) {
          await tx.detalleFilmacion.create({
            data: {
              idEventoServicio: es.id,
              incluyeHighlight: servicio.detalleFilmacion.incluyeHighlight,
              notas:            servicio.detalleFilmacion.notas ?? null,
            },
          });
        }

        if (servicio.detalleCuadroFirma) {
          await tx.detalleCuadroFirma.create({
            data: {
              idEventoServicio: es.id,
              descripcion:      servicio.detalleCuadroFirma.descripcion,
            },
          });
        }
      }

      return ev;
    });

    return this.toDomain(evento);
  }

  async update(id: number, dto: ActualizarEventoDto): Promise<Evento | null> {
    try {
      const evento = await prisma.evento.update({
        where: { id },
        data:  dto,
      });
      return this.toDomain(evento);
    } catch {
      return null;
    }
  }

  // Soft delete: marca el evento como archivado en vez de borrar el registro.
  // Esto preserva integridad referencial con contratos y servicios contratados.
  async delete(id: number): Promise<boolean> {
    try {
      await prisma.evento.update({
        where: { id },
        data:  { activo: false },
      });
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
    activo: boolean;
  }): Evento {
    return {
      id:           p.id,
      idCliente:    p.idCliente,
      idTipoEvento: p.idTipoEvento,
      direccion:    p.direccion,
      fechaHora:    p.fechaHora,
      notas:        p.notas ?? undefined,
      activo:       p.activo,
    };
  }
}
