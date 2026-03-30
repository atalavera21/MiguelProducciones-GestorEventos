import { type Cliente } from '../../../domain/entities/Cliente';
import { type IClienteRepository } from '../../../domain/repositories/IClienteRepository';

export class GetClienteById {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(id: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findById(id);

    // Si no existe el cliente, lanzamos un error con mensaje claro.
    // El controller de la capa presentation lo capturará y devolverá un 404.
    // En .NET harías: throw new NotFoundException($"Cliente {id} no encontrado");
    if (!cliente) {
      throw new Error(`Cliente con id "${id}" no encontrado`);
    }

    return cliente;
  }
}
