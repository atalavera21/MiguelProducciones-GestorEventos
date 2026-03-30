import { type Evento, type ActualizarEventoDto } from '../../../domain/entities/Evento';
import { type IEventoRepository } from '../../../domain/repositories/IEventoRepository';

export class UpdateEvento {
  constructor(private readonly eventoRepository: IEventoRepository) {}

  async execute(id: number, dto: ActualizarEventoDto): Promise<Evento> {
    const evento = await this.eventoRepository.findById(id);
    if (!evento) {
      throw new Error(`Evento con id ${id} no encontrado`);
    }

    // Nota: el estado del evento se deriva del contrato asociado.
    // Las validaciones de estado (ej: no modificar si está cancelado)
    // se aplican a nivel de contrato, no de evento.

    const actualizado = await this.eventoRepository.update(id, dto);
    if (!actualizado) {
      throw new Error(`Error al actualizar el evento ${id}`);
    }

    return actualizado;
  }
}
