import { type Cliente, type CrearClienteDto } from '../../../domain/entities/Cliente';
import { type IClienteRepository } from '../../../domain/repositories/IClienteRepository';

export class CreateCliente {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(dto: CrearClienteDto): Promise<Cliente> {
    // Aquí va la lógica de negocio antes de persistir.
    // Por ejemplo: validar que el teléfono no esté ya registrado.
    // Por ahora lo dejamos simple — la validación básica la hará el controller.
    return this.clienteRepository.create(dto);
  }
}
