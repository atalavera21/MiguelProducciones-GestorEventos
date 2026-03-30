import { type Contrato, type CrearContratoDto, type ActualizarContratoDto } from '../entities/Contrato';

export interface IContratoRepository {
  findById(id: number): Promise<Contrato | null>;
  findAll(): Promise<Contrato[]>;
  findByEventoId(idEvento: number): Promise<Contrato | null>; // Un evento tiene como máximo un contrato
  create(dto: CrearContratoDto): Promise<Contrato>;
  update(id: number, dto: ActualizarContratoDto): Promise<Contrato | null>;
  delete(id: number): Promise<boolean>;
}
