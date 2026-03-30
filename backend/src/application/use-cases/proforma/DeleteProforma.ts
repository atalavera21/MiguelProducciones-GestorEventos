import { type IProformaRepository } from '../../../domain/repositories/IProformaRepository';

export class DeleteProforma {
  constructor(private readonly proformaRepository: IProformaRepository) {}

  async execute(id: number): Promise<void> {
    const existe = await this.proformaRepository.findById(id);
    if (!existe) {
      throw new Error(`Proforma con id ${id} no encontrada`);
    }

    await this.proformaRepository.delete(id);
  }
}
