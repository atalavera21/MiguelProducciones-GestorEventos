import { type IClienteRepository } from '../../../domain/repositories/IClienteRepository';

export class DeleteCliente {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(id: number): Promise<void> {
    const existe = await this.clienteRepository.findById(id);
    if (!existe) {
      throw new Error(`Cliente con id ${id} no encontrado`);
    }

    await this.clienteRepository.delete(id);
  }
}
