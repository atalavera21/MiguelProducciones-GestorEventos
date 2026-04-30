import { type Proforma, type CrearProformaDto } from '../../../domain/entities/Proforma';
import { type IProformaRepository } from '../../../domain/repositories/IProformaRepository';
import { ValidationError } from '../../../shared/errors/AppError';

// La proforma es un documento independiente — no valida contra clientes
// ni eventos existentes. Se puede hacer para alguien que aún no está
// registrado en el sistema.

export class CreateProforma {
  constructor(private readonly proformaRepository: IProformaRepository) {}

  async execute(dto: CrearProformaDto): Promise<Proforma> {
    if (dto.servicios.length === 0) {
      throw new ValidationError('La proforma debe tener al menos un servicio');
    }

    return this.proformaRepository.create(dto);
  }
}
