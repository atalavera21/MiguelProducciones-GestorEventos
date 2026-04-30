import { type Contrato } from '../../../domain/entities/Contrato';
import { type IContratoRepository } from '../../../domain/repositories/IContratoRepository';
import { NotFoundError } from '../../../shared/errors/AppError';

export class GetContratoById {
  constructor(private readonly contratoRepository: IContratoRepository) {}

  async execute(id: number): Promise<Contrato> {
    const contrato = await this.contratoRepository.findById(id);
    if (!contrato) {
      throw new NotFoundError(`Contrato con id ${id} no encontrado`);
    }
    return contrato;
  }
}
