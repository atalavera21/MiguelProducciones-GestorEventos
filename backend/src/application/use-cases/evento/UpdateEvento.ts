import { type Evento, type ActualizarEventoDto, EstadoEvento } from '../../../domain/entities/Evento';
import { type IEventoRepository } from '../../../domain/repositories/IEventoRepository';

export class UpdateEvento {
  constructor(private readonly eventoRepository: IEventoRepository) {}

  async execute(id: string, dto: ActualizarEventoDto): Promise<Evento> {
    const evento = await this.eventoRepository.findById(id);
    if (!evento) {
      throw new Error(`Evento con id "${id}" no encontrado`);
    }

    // Regla de negocio: un evento cancelado no se puede modificar.
    // Este tipo de validación pertenece aquí — en el caso de uso —
    // no en el controller ni en el repositorio.
    if (evento.estado === EstadoEvento.CANCELADO) {
      throw new Error('No se puede modificar un evento cancelado');
    }

    const actualizado = await this.eventoRepository.update(id, dto);
    if (!actualizado) {
      throw new Error(`Error al actualizar el evento "${id}"`);
    }

    return actualizado;
  }
}
