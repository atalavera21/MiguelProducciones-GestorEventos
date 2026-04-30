import { type Contrato } from '../../../domain/entities/Contrato';
import { ActualizarEstadoContrato } from './ActualizarEstadoContrato';
import { ESTADOS_CONTRATO } from '../../../domain/entities/EstadoContrato';

// "Eliminar" un contrato = transicionar a Cancelado.
// El registro se conserva intacto para mantener el historial fiel.
// Reutiliza ActualizarEstadoContrato para respetar las reglas de transición.
export class CancelarContrato {
  constructor(private readonly actualizarEstado: ActualizarEstadoContrato) {}

  async execute(id: number): Promise<Contrato> {
    return this.actualizarEstado.execute(id, ESTADOS_CONTRATO.CANCELADO);
  }
}
