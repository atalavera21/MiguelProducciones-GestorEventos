import { type Contrato, type ActualizarContratoDto } from '../entities/Contrato';

// Payload completo que el repositorio persiste — todos los campos del contrato menos el id.
// El use case GenerarContrato es responsable de construirlo a partir del evento y sus relaciones.
export type ContratoNuevoData = Omit<Contrato, 'id'>;

export interface IContratoRepository {
  findById(id: number): Promise<Contrato | null>;
  findAll(): Promise<Contrato[]>;
  findByEventoId(idEvento: number): Promise<Contrato | null>; // Un evento tiene como máximo un contrato
  create(data: ContratoNuevoData): Promise<Contrato>;
  update(id: number, dto: ActualizarContratoDto): Promise<Contrato | null>;
  delete(id: number): Promise<boolean>;
}
