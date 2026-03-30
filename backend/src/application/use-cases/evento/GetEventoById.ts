import { type Evento } from '../../../domain/entities/Evento';
import { type IEventoRepository } from '../../../domain/repositories/IEventoRepository';

export class GetEventoById {
  constructor(private readonly eventoRepository: IEventoRepository) {}

  async execute(id: number): Promise<Evento> {
    const evento = await this.eventoRepository.findById(id);
    if (!evento) {
      throw new Error(`Evento con id ${id} no encontrado`);
    }
    return evento;
  }
}
