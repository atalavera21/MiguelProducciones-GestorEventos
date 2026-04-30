import { type IEventoRepository } from '../../../domain/repositories/IEventoRepository';
import { type IContratoRepository } from '../../../domain/repositories/IContratoRepository';
import { ESTADOS_CONTRATO } from '../../../domain/entities/EstadoContrato';
import { NotFoundError, ConflictError } from '../../../shared/errors/AppError';

// Soft delete del evento.
// No se puede archivar un evento si tiene un contrato vivo (no Cancelado).
// Para archivar uno con contrato, primero debe cancelarse el contrato.
export class DeleteEvento {
  constructor(
    private readonly eventoRepository: IEventoRepository,
    private readonly contratoRepository: IContratoRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const evento = await this.eventoRepository.findById(id);
    if (!evento) {
      throw new NotFoundError(`Evento con id ${id} no encontrado`);
    }

    const contrato = await this.contratoRepository.findByEventoId(id);
    if (contrato && contrato.idEstado !== ESTADOS_CONTRATO.CANCELADO) {
      throw new ConflictError(
        `No se puede archivar el evento ${id}: tiene un contrato vivo. Cancela el contrato primero.`,
      );
    }

    await this.eventoRepository.delete(id);
  }
}
