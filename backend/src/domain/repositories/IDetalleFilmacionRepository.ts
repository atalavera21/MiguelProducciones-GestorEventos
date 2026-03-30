import { type DetalleFilmacion, type CrearDetalleFilmacionDto } from '../entities/DetalleFilmacion';

export interface IDetalleFilmacionRepository {
  findByEventoServicioId(idEventoServicio: number): Promise<DetalleFilmacion | null>;
  create(dto: CrearDetalleFilmacionDto): Promise<DetalleFilmacion>;
  update(id: number, dto: Partial<CrearDetalleFilmacionDto>): Promise<DetalleFilmacion | null>;
}
