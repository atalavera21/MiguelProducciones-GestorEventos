import { type Proforma, type CrearProformaDto } from '../entities/Proforma';

export interface IProformaRepository {
  findById(id: string): Promise<Proforma | null>;
  findByEventoId(eventoId: string): Promise<Proforma[]>;
  create(dto: CrearProformaDto): Promise<Proforma>;
  delete(id: string): Promise<boolean>;
}
