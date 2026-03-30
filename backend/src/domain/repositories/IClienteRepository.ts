import { type Cliente, type CrearClienteDto, type ActualizarClienteDto } from '../entities/Cliente';

// Contrato que define qué operaciones existen sobre clientes.
// No sabe si detrás hay PostgreSQL, un archivo o una API externa.
// Eso es responsabilidad de infraestructura.
//
// En .NET equivale a: public interface IClienteRepository { ... }

export interface IClienteRepository {
  findById(id: number): Promise<Cliente | null>;
  findAll(): Promise<Cliente[]>;
  findActivos(): Promise<Cliente[]>;  // Solo clientes con activo = true
  create(dto: CrearClienteDto): Promise<Cliente>;
  update(id: number, dto: ActualizarClienteDto): Promise<Cliente | null>;
  delete(id: number): Promise<boolean>;
}
