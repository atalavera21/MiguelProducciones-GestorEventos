import { type Contrato, type CrearContratoDto, type ActualizarContratoDto } from '../entities/Contrato';

export interface IContratoRepository {
  findById(id: string): Promise<Contrato | null>;
  findByEventoId(eventoId: string): Promise<Contrato[]>;
  create(dto: CrearContratoDto): Promise<Contrato>;
  update(id: string, dto: ActualizarContratoDto): Promise<Contrato | null>;
  delete(id: string): Promise<boolean>;
}
