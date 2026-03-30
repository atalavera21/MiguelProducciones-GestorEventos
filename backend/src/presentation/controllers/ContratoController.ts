import { type Request, type Response } from 'express';

import { GenerarContrato } from '../../application/use-cases/contrato/GenerarContrato';
import { GetContratoById } from '../../application/use-cases/contrato/GetContratoById';
import { ActualizarEstadoContrato } from '../../application/use-cases/contrato/ActualizarEstadoContrato';
import { PrismaContratoRepository } from '../../infrastructure/repositories/PrismaContratoRepository';
import { PrismaEventoRepository } from '../../infrastructure/repositories/PrismaEventoRepository';
import { PrismaClienteRepository } from '../../infrastructure/repositories/PrismaClienteRepository';
import { PrismaTipoEventoRepository } from '../../infrastructure/repositories/PrismaTipoEventoRepository';

export class ContratoController {
  private readonly generarContrato: GenerarContrato;
  private readonly getContratoById: GetContratoById;
  private readonly actualizarEstado: ActualizarEstadoContrato;

  constructor() {
    const contratoRepository   = new PrismaContratoRepository();
    const eventoRepository     = new PrismaEventoRepository();
    const clienteRepository    = new PrismaClienteRepository();
    const tipoEventoRepository = new PrismaTipoEventoRepository();

    this.generarContrato  = new GenerarContrato(contratoRepository, eventoRepository, clienteRepository, tipoEventoRepository);
    this.getContratoById  = new GetContratoById(contratoRepository);
    this.actualizarEstado = new ActualizarEstadoContrato(contratoRepository);
  }

  // POST /api/contratos/desde-evento/:idEvento
  generar = async (req: Request, res: Response): Promise<void> => {
    try {
      const contrato = await this.generarContrato.execute({
        idEvento:     Number(req.params.idEvento),
        ...req.body,
      });
      res.status(201).json({ data: contrato });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // GET /api/contratos/:id
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const contrato = await this.getContratoById.execute(Number(req.params.id));
      res.json({ data: contrato });
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  };

  // PATCH /api/contratos/:id/estado
  actualizarEstadoHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const contrato = await this.actualizarEstado.execute(
        Number(req.params.id),
        Number(req.body.idEstado),
      );
      res.json({ data: contrato });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };
}
