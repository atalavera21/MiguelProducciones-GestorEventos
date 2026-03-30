import { type IEventoRepository } from '../../../domain/repositories/IEventoRepository';
import { type IContratoRepository } from '../../../domain/repositories/IContratoRepository';
import { ESTADOS_CONTRATO } from '../../../domain/entities/EstadoContrato';

export class DeleteEvento {
  constructor(
    private readonly eventoRepository: IEventoRepository,
    // Necesitamos verificar el contrato antes de eliminar el evento.
    // No se puede eliminar un evento con un contrato activo o terminado.
    private readonly contratoRepository: IContratoRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const evento = await this.eventoRepository.findById(id);
    if (!evento) {
      throw new Error(`Evento con id ${id} no encontrado`);
    }

    // Regla de negocio: no se puede eliminar un evento con contrato activo o terminado
    const contrato = await this.contratoRepository.findByEventoId(id);
    if (contrato) {
      const estadosProtegidos = [
        ESTADOS_CONTRATO.PENDIENTE_ENTREGA,
        ESTADOS_CONTRATO.TERMINADO,
      ];
      if (estadosProtegidos.includes(contrato.idEstado as any)) {
        throw new Error(`No se puede eliminar el evento: tiene un contrato en curso`);
      }
    }

    await this.eventoRepository.delete(id);
  }
}
