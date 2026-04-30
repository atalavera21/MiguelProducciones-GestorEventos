import { type Proforma } from '../../../domain/entities/Proforma';
import { type IProformaRepository } from '../../../domain/repositories/IProformaRepository';
import { NotFoundError } from '../../../shared/errors/AppError';

export class GetProformaById {
  constructor(private readonly proformaRepository: IProformaRepository) {}

  async execute(id: number): Promise<Proforma> {
    const proforma = await this.proformaRepository.findById(id);
    if (!proforma) {
      throw new NotFoundError(`Proforma con id ${id} no encontrada`);
    }
    return proforma;
  }
}
