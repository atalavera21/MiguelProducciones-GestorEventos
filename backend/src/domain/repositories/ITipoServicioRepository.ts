import { type TipoServicio } from '../entities/TipoServicio';

export interface ITipoServicioRepository {
  findById(id: number): Promise<TipoServicio | null>;
  findAll(): Promise<TipoServicio[]>;
  findActivos(): Promise<TipoServicio[]>;
}
