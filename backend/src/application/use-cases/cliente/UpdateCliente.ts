import { type Cliente, type ActualizarClienteDto } from '../../../domain/entities/Cliente';
import { type IClienteRepository } from '../../../domain/repositories/IClienteRepository';

export class UpdateCliente {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(id: number, dto: ActualizarClienteDto): Promise<Cliente> {
    const existe = await this.clienteRepository.findById(id);
    if (!existe) {
      throw new Error(`Cliente con id ${id} no encontrado`);
    }

    const actualizado = await this.clienteRepository.update(id, dto);

    // Este null check es para satisfacer a TypeScript — si llegamos aquí
    // ya confirmamos que existe, así que nunca debería ser null
    if (!actualizado) {
      throw new Error(`Error al actualizar el cliente ${id}`);
    }

    return actualizado;
  }
}
