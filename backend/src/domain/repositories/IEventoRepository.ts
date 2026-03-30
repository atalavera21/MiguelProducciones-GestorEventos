import { type Evento, type CrearEventoDto, type ActualizarEventoDto } from '../entities/Evento';

export interface IEventoRepository {
  findById(id: number): Promise<Evento | null>;
  findAll(): Promise<Evento[]>;
  findByClienteId(idCliente: number): Promise<Evento[]>;
  create(dto: CrearEventoDto): Promise<Evento>;
  update(id: number, dto: ActualizarEventoDto): Promise<Evento | null>;
  delete(id: number): Promise<boolean>;
}
