import { type Evento, type CrearEventoDto, type ActualizarEventoDto } from '../entities/Evento';

export interface IEventoRepository {
  findById(id: string): Promise<Evento | null>;
  findAll(): Promise<Evento[]>;
  findByClienteId(clienteId: string): Promise<Evento[]>;
  create(dto: CrearEventoDto): Promise<Evento>;
  update(id: string, dto: ActualizarEventoDto): Promise<Evento | null>;
  delete(id: string): Promise<boolean>;
}
