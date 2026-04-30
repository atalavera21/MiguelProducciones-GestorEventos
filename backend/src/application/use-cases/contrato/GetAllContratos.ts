import { type Contrato } from '../../../domain/entities/Contrato';
import { type IContratoRepository } from '../../../domain/repositories/IContratoRepository';

export class GetAllContratos {
  constructor(private readonly contratoRepository: IContratoRepository) {}

  async execute(): Promise<Contrato[]> {
    return this.contratoRepository.findAll();
  }
}
