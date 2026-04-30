import { type Cliente, type ActualizarClienteDto } from '../../../domain/entities/Cliente';
import { type IClienteRepository } from '../../../domain/repositories/IClienteRepository';
import { NotFoundError, AppError } from '../../../shared/errors/AppError';

export class UpdateCliente {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(id: number, dto: ActualizarClienteDto): Promise<Cliente> {
    const existe = await this.clienteRepository.findById(id);
    if (!existe) {
      throw new NotFoundError(`Cliente con id ${id} no encontrado`);
    }

    const actualizado = await this.clienteRepository.update(id, dto);
    if (!actualizado) {
      throw new AppError(`Error al actualizar el cliente ${id}`, 500);
    }

    return actualizado;
  }
}
