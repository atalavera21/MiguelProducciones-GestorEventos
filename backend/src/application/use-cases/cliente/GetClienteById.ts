import { type Cliente } from '../../../domain/entities/Cliente';
import { type IClienteRepository } from '../../../domain/repositories/IClienteRepository';
import { NotFoundError } from '../../../shared/errors/AppError';

export class GetClienteById {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findById(id);
    if (!cliente) {
      throw new NotFoundError(`Cliente con id ${id} no encontrado`);
    }
    return cliente;
  }
}
