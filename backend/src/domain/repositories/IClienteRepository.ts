import { type Cliente, type CrearClienteDto, type ActualizarClienteDto } from '../entities/Cliente';

// Esta interfaz es el CONTRATO que define qué operaciones existen
// sobre los clientes. No sabe si detrás hay PostgreSQL, un archivo
// de texto, o una API externa. Eso es responsabilidad de infraestructura.
//
// En .NET equivale a:
//   public interface IClienteRepository { ... }
//   en tu capa de Dominio o Application.

export interface IClienteRepository {
  // Equivale a: Task<Cliente?> GetByIdAsync(Guid id)
  findById(id: string): Promise<Cliente | null>;

  // Equivale a: Task<IEnumerable<Cliente>> GetAllAsync()
  findAll(): Promise<Cliente[]>;

  // Equivale a: Task<Cliente> CreateAsync(CrearClienteDto dto)
  create(dto: CrearClienteDto): Promise<Cliente>;

  // Equivale a: Task<Cliente?> UpdateAsync(Guid id, ActualizarClienteDto dto)
  update(id: string, dto: ActualizarClienteDto): Promise<Cliente | null>;

  // Equivale a: Task<bool> DeleteAsync(Guid id)
  delete(id: string): Promise<boolean>;
}
