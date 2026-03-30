import { type EventoServicio, type CrearEventoServicioDto } from '../entities/EventoServicio';

export interface IEventoServicioRepository {
  findById(id: number): Promise<EventoServicio | null>;
  findByEventoId(idEvento: number): Promise<EventoServicio[]>;
  create(dto: CrearEventoServicioDto): Promise<EventoServicio>;
  delete(id: number): Promise<boolean>;
}
