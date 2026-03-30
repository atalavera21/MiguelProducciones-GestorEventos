import { type DetalleCuadroFirma, type CrearDetalleCuadroFirmaDto } from '../entities/DetalleCuadroFirma';

export interface IDetalleCuadroFirmaRepository {
  findByEventoServicioId(idEventoServicio: number): Promise<DetalleCuadroFirma | null>;
  create(dto: CrearDetalleCuadroFirmaDto): Promise<DetalleCuadroFirma>;
  update(id: number, dto: Partial<CrearDetalleCuadroFirmaDto>): Promise<DetalleCuadroFirma | null>;
}
