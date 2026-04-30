import { type EventoResumen } from '../../../domain/entities/Evento';
import { type IEventoRepository } from '../../../domain/repositories/IEventoRepository';

export class GetAllEventos {
  constructor(private readonly eventoRepository: IEventoRepository) {}

  async execute(): Promise<EventoResumen[]> {
    return this.eventoRepository.findAll();
  }
}
