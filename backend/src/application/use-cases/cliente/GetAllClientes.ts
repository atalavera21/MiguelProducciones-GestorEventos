import { type Cliente } from '../../../domain/entities/Cliente';
import { type IClienteRepository } from '../../../domain/repositories/IClienteRepository';

// Un caso de uso = una acción de negocio concreta.
// Este se encarga de una sola cosa: obtener todos los clientes.
//
// En .NET con MediatR equivale a:
//   public class GetAllClientesHandler : IRequestHandler<GetAllClientesQuery, List<Cliente>>
//
// La diferencia: no usamos MediatR como intermediario.
// El controller llamará directamente a este caso de uso.

export class GetAllClientes {
  // El repositorio se inyecta por constructor — igual que en .NET.
  // Recibimos la INTERFAZ (IClienteRepository), no la implementación concreta.
  // Esto permite que en el futuro podamos cambiar Prisma por otra cosa
  // sin tocar este archivo.
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(): Promise<Cliente[]> {
    return this.clienteRepository.findAll();
  }
}
