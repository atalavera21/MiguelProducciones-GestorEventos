import { type Evento, type CrearEventoDto } from '../../../domain/entities/Evento';
import { type IEventoRepository } from '../../../domain/repositories/IEventoRepository';
import { type IClienteRepository } from '../../../domain/repositories/IClienteRepository';

export class CreateEvento {
  constructor(
    private readonly eventoRepository: IEventoRepository,
    // Necesitamos el repositorio de clientes para validar que el cliente existe.
    // Un evento no puede existir sin un cliente válido.
    private readonly clienteRepository: IClienteRepository,
  ) {}

  async execute(dto: CrearEventoDto): Promise<Evento> {
    // Regla de negocio: no se puede agendar un evento para un cliente inexistente.
    // Este es el tipo de lógica que vive en Application, no en el Controller.
    const cliente = await this.clienteRepository.findById(dto.clienteId);
    if (!cliente) {
      throw new Error(`No se puede crear el evento: cliente "${dto.clienteId}" no existe`);
    }

    return this.eventoRepository.create(dto);
  }
}
