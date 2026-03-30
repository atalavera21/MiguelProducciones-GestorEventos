import { type EstadoContrato } from '../entities/EstadoContrato';

// Los estados son fijos — se cargan por seed y no cambian.
// Solo se necesita consultarlos para mostrarlos en la UI o validar transiciones.

export interface IEstadoContratoRepository {
  findById(id: number): Promise<EstadoContrato | null>;
  findAll(): Promise<EstadoContrato[]>;
}
