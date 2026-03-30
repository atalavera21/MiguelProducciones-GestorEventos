import { type DetalleFotografia, type CrearDetalleFotografiaDto } from '../entities/DetalleFotografia';

export interface IDetalleFotografiaRepository {
  findByEventoServicioId(idEventoServicio: number): Promise<DetalleFotografia | null>;
  create(dto: CrearDetalleFotografiaDto): Promise<DetalleFotografia>;
  update(id: number, dto: Partial<CrearDetalleFotografiaDto>): Promise<DetalleFotografia | null>;
}
