import { type IEventoRepository } from '../../../domain/repositories/IEventoRepository';

export class DeleteEvento {
  constructor(private readonly eventoRepository: IEventoRepository) {}

  async execute(id: string): Promise<void> {
    const evento = await this.eventoRepository.findById(id);
    if (!evento) {
      throw new Error(`Evento con id "${id}" no encontrado`);
    }

    await this.eventoRepository.delete(id);
  }
}
