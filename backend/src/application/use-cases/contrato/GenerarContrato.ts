import { type Contrato, type CrearContratoDto } from '../../../domain/entities/Contrato';
import { type IContratoRepository } from '../../../domain/repositories/IContratoRepository';
import { type IEventoRepository } from '../../../domain/repositories/IEventoRepository';
import { type IClienteRepository } from '../../../domain/repositories/IClienteRepository';
import { type ITipoEventoRepository } from '../../../domain/repositories/ITipoEventoRepository';
import { type IEventoServicioRepository } from '../../../domain/repositories/IEventoServicioRepository';
import { ESTADOS_CONTRATO } from '../../../domain/entities/EstadoContrato';
import { NotFoundError, ConflictError, ValidationError } from '../../../shared/errors/AppError';

// Caso de uso principal del módulo de contratos.
// Se dispara cuando el usuario pulsa "Generar contrato" desde un evento.
// Consulta el evento, el cliente, el tipo de evento y los servicios contratados,
// y construye el contrato con datos desnormalizados (snapshot inmutable).
//
// La desnormalización es intencional: el contrato debe reflejar el acuerdo
// exactamente como fue firmado, sin importar ediciones futuras del cliente o evento.

export class GenerarContrato {
  constructor(
    private readonly contratoRepository: IContratoRepository,
    private readonly eventoRepository: IEventoRepository,
    private readonly clienteRepository: IClienteRepository,
    private readonly tipoEventoRepository: ITipoEventoRepository,
    private readonly eventoServicioRepository: IEventoServicioRepository,
  ) {}

  async execute(dto: CrearContratoDto): Promise<Contrato> {
    // 1. Verificar que el evento existe
    const evento = await this.eventoRepository.findById(dto.idEvento);
    if (!evento) {
      throw new NotFoundError(`Evento ${dto.idEvento} no encontrado`);
    }

    // 2. Verificar que no haya contrato previo para este evento
    const contratoExistente = await this.contratoRepository.findByEventoId(dto.idEvento);
    if (contratoExistente) {
      throw new ConflictError(`El evento ${dto.idEvento} ya tiene un contrato generado`);
    }

    // 3. Cargar relaciones necesarias para desnormalizar
    const cliente = await this.clienteRepository.findById(evento.idCliente);
    if (!cliente) {
      throw new NotFoundError(`Cliente ${evento.idCliente} no encontrado`);
    }

    const tipoEvento = await this.tipoEventoRepository.findById(evento.idTipoEvento);
    if (!tipoEvento) {
      throw new NotFoundError(`Tipo de evento ${evento.idTipoEvento} no encontrado`);
    }

    const servicios = await this.eventoServicioRepository.findByEventoId(evento.id);
    if (servicios.length === 0) {
      throw new ValidationError(
        `No se puede generar contrato: el evento ${evento.id} no tiene servicios asignados`,
      );
    }

    // 4. Calcular monto total y saldo
    const montoTotal = servicios.reduce((acc, s) => acc + s.precio, 0);
    if (dto.montoAdelanto > montoTotal) {
      throw new ValidationError(
        `El adelanto (${dto.montoAdelanto}) no puede ser mayor al total (${montoTotal})`,
      );
    }
    const saldo = montoTotal - dto.montoAdelanto;

    // 5. Persistir contrato con todos los datos desnormalizados
    return this.contratoRepository.create({
      idEvento:        evento.id,
      idEstado:        ESTADOS_CONTRATO.PENDIENTE,
      // Snapshot del cliente
      nombreCliente:   cliente.nombre,
      dniCliente:      cliente.dni,
      telefonoCliente: cliente.telefono,
      // Snapshot del evento
      tipoEvento:      tipoEvento.nombre,
      direccionEvento: evento.direccion,
      fechaHoraEvento: evento.fechaHora,
      // Montos
      montoTotal,
      montoAdelanto:   dto.montoAdelanto,
      saldo,
      // Pago
      metodoPago:      dto.metodoPago,
      cuentaPago:      dto.cuentaPago,
      // Firma
      dniFotografo:    dto.dniFotografo,
      fechaContrato:   dto.fechaContrato,
      pdfUrl:          undefined,  // Se llena al generar el PDF (paso separado)
    });
  }
}
