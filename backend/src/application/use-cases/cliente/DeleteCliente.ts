import { type IClienteRepository } from '../../../domain/repositories/IClienteRepository';
import { NotFoundError } from '../../../shared/errors/AppError';

// Soft delete — marca el cliente como inactivo. El registro se conserva
// para preservar el historial de eventos y contratos asociados.
export class DeleteCliente {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(id: number): Promise<void> {
    const existe = await this.clienteRepository.findById(id);
    if (!existe) {
      throw new NotFoundError(`Cliente con id ${id} no encontrado`);
    }

    await this.clienteRepository.delete(id);
  }
}
