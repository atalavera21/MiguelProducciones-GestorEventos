import { type Contrato, type CrearContratoDto } from '../../../domain/entities/Contrato';
import { type IContratoRepository } from '../../../domain/repositories/IContratoRepository';
import { type IEventoRepository } from '../../../domain/repositories/IEventoRepository';
import { type IClienteRepository } from '../../../domain/repositories/IClienteRepository';
import { type ITipoEventoRepository } from '../../../domain/repositories/ITipoEventoRepository';

// Caso de uso principal del módulo de contratos.
// Se dispara cuando el usuario pulsa "Generar contrato" desde un evento.
// Consulta el evento y el cliente, copia sus datos al contrato (desnormalización)
// y lo persiste. El PDF se genera en un paso separado (GenerarPdfContrato).

export class GenerarContrato {
  constructor(
    private readonly contratoRepository: IContratoRepository,
    private readonly eventoRepository: IEventoRepository,
    private readonly clienteRepository: IClienteRepository,
    private readonly tipoEventoRepository: ITipoEventoRepository,
  ) {}

  async execute(dto: CrearContratoDto): Promise<Contrato> {
    // 1. Verificar que el evento existe
    const evento = await this.eventoRepository.findById(dto.idEvento);
    if (!evento) {
      throw new Error(`Evento ${dto.idEvento} no encontrado`);
    }

    // 2. Verificar que no existe ya un contrato para este evento
    const contratoExistente = await this.contratoRepository.findByEventoId(dto.idEvento);
    if (contratoExistente) {
      throw new Error(`El evento ${dto.idEvento} ya tiene un contrato generado`);
    }

    // 3. Obtener el cliente y el tipo de evento para desnormalizar
    const cliente = await this.clienteRepository.findById(evento.idCliente);
    if (!cliente) {
      throw new Error(`Cliente ${evento.idCliente} no encontrado`);
    }

    const tipoEvento = await this.tipoEventoRepository.findById(evento.idTipoEvento);
    if (!tipoEvento) {
      throw new Error(`Tipo de evento ${evento.idTipoEvento} no encontrado`);
    }

    // 5. Crear el contrato con datos desnormalizados
    return this.contratoRepository.create({
      ...dto,
      // Los datos del cliente y del evento se copian en este momento.
      // Si el cliente o el evento cambian después, el contrato no cambia.
    });
  }
}
