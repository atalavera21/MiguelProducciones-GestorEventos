import { type IProformaRepository } from '../../../domain/repositories/IProformaRepository';
import { NotFoundError } from '../../../shared/errors/AppError';

// Hard delete — la proforma es desechable por diseño.
// No tiene historial que preservar.
export class DeleteProforma {
  constructor(private readonly proformaRepository: IProformaRepository) {}

  async execute(id: number): Promise<void> {
    const existe = await this.proformaRepository.findById(id);
    if (!existe) {
      throw new NotFoundError(`Proforma con id ${id} no encontrada`);
    }

    await this.proformaRepository.delete(id);
  }
}
