import { type Evento, type CrearEventoDto } from '../../../domain/entities/Evento';
import { type IEventoRepository } from '../../../domain/repositories/IEventoRepository';
import { type IClienteRepository } from '../../../domain/repositories/IClienteRepository';
import { NotFoundError, ValidationError } from '../../../shared/errors/AppError';

export class CreateEvento {
  constructor(
    private readonly eventoRepository: IEventoRepository,
    // Necesitamos el repositorio de clientes para validar que el cliente existe
    // y que está activo. Un evento no puede agendarse contra un cliente archivado.
    private readonly clienteRepository: IClienteRepository,
  ) {}

  async execute(dto: CrearEventoDto): Promise<Evento> {
    const cliente = await this.clienteRepository.findById(dto.idCliente);
    if (!cliente) {
      throw new NotFoundError(`Cliente ${dto.idCliente} no encontrado`);
    }

    if (!cliente.activo) {
      throw new ValidationError(
        `No se puede crear el evento: el cliente ${dto.idCliente} está archivado`,
      );
    }

    return this.eventoRepository.create(dto);
  }
}
