import { type Evento, type ActualizarEventoDto } from '../../../domain/entities/Evento';
import { type IEventoRepository } from '../../../domain/repositories/IEventoRepository';
import { NotFoundError, AppError } from '../../../shared/errors/AppError';

export class UpdateEvento {
  constructor(private readonly eventoRepository: IEventoRepository) {}

  async execute(id: number, dto: ActualizarEventoDto): Promise<Evento> {
    const evento = await this.eventoRepository.findById(id);
    if (!evento) {
      throw new NotFoundError(`Evento con id ${id} no encontrado`);
    }

    // Las validaciones sobre estado del contrato (no editar si está cancelado, etc.)
    // viven en el módulo de contratos, no aquí.

    const actualizado = await this.eventoRepository.update(id, dto);
    if (!actualizado) {
      throw new AppError(`Error al actualizar el evento ${id}`, 500);
    }

    return actualizado;
  }
}
