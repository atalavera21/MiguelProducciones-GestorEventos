import { type Proforma, type CrearProformaDto } from '../entities/Proforma';

// La proforma no tiene findByEventoId porque es un documento independiente
// sin relación con ninguna otra tabla — no existe eventoId en proformas.

export interface IProformaRepository {
  findById(id: number): Promise<Proforma | null>;
  findAll(): Promise<Proforma[]>;
  create(dto: CrearProformaDto): Promise<Proforma>;
  delete(id: number): Promise<boolean>;
}
