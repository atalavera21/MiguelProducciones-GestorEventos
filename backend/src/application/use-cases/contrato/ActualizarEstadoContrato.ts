import { type Contrato } from '../../../domain/entities/Contrato';
import { type IContratoRepository } from '../../../domain/repositories/IContratoRepository';
import { ESTADOS_CONTRATO } from '../../../domain/entities/EstadoContrato';

// Gestiona las transiciones de estado del contrato.
// Flujo normal:  Pendiente → PendienteEntrega → Terminado
// Cancelación:   Pendiente → Cancelado
//                PendienteEntrega → Cancelado

const TRANSICIONES_VALIDAS: Record<number, number[]> = {
  [ESTADOS_CONTRATO.PENDIENTE]:         [ESTADOS_CONTRATO.PENDIENTE_ENTREGA, ESTADOS_CONTRATO.CANCELADO],
  [ESTADOS_CONTRATO.PENDIENTE_ENTREGA]: [ESTADOS_CONTRATO.TERMINADO, ESTADOS_CONTRATO.CANCELADO],
  [ESTADOS_CONTRATO.TERMINADO]:         [],  // Estado final
  [ESTADOS_CONTRATO.CANCELADO]:         [],  // Estado final
};

export class ActualizarEstadoContrato {
  constructor(private readonly contratoRepository: IContratoRepository) {}

  async execute(id: number, nuevoEstado: number): Promise<Contrato> {
    const contrato = await this.contratoRepository.findById(id);
    if (!contrato) {
      throw new Error(`Contrato con id ${id} no encontrado`);
    }

    const transicionesPermitidas = TRANSICIONES_VALIDAS[contrato.idEstado] ?? [];
    if (!transicionesPermitidas.includes(nuevoEstado)) {
      throw new Error(
        `Transición de estado inválida: no se puede pasar de ${contrato.idEstado} a ${nuevoEstado}`
      );
    }

    const actualizado = await this.contratoRepository.update(id, { idEstado: nuevoEstado });
    if (!actualizado) {
      throw new Error(`Error al actualizar el estado del contrato ${id}`);
    }

    return actualizado;
  }
}
