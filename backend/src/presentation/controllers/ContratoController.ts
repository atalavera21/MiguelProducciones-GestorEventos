import { type Request, type Response, type NextFunction } from 'express';

import { GenerarContrato } from '../../application/use-cases/contrato/GenerarContrato';
import { GetAllContratos } from '../../application/use-cases/contrato/GetAllContratos';
import { GetContratoById } from '../../application/use-cases/contrato/GetContratoById';
import { ActualizarEstadoContrato } from '../../application/use-cases/contrato/ActualizarEstadoContrato';
import { CancelarContrato } from '../../application/use-cases/contrato/CancelarContrato';
import { PrismaContratoRepository } from '../../infrastructure/repositories/PrismaContratoRepository';
import { PrismaEventoRepository } from '../../infrastructure/repositories/PrismaEventoRepository';
import { PrismaClienteRepository } from '../../infrastructure/repositories/PrismaClienteRepository';
import { PrismaTipoEventoRepository } from '../../infrastructure/repositories/PrismaTipoEventoRepository';
import { PrismaEventoServicioRepository } from '../../infrastructure/repositories/PrismaEventoServicioRepository';
import { generarContratoSchema, actualizarEstadoSchema } from '../schemas/contrato.schema';

export class ContratoController {
  private readonly generar: GenerarContrato;
  private readonly getAll: GetAllContratos;
  private readonly getById: GetContratoById;
  private readonly actualizarEstado: ActualizarEstadoContrato;
  private readonly cancelar: CancelarContrato;

  constructor() {
    const contratoRepo        = new PrismaContratoRepository();
    const eventoRepo          = new PrismaEventoRepository();
    const clienteRepo         = new PrismaClienteRepository();
    const tipoEventoRepo      = new PrismaTipoEventoRepository();
    const eventoServicioRepo  = new PrismaEventoServicioRepository();

    this.generar          = new GenerarContrato(contratoRepo, eventoRepo, clienteRepo, tipoEventoRepo, eventoServicioRepo);
    this.getAll           = new GetAllContratos(contratoRepo);
    this.getById          = new GetContratoById(contratoRepo);
    this.actualizarEstado = new ActualizarEstadoContrato(contratoRepo);
    this.cancelar         = new CancelarContrato(this.actualizarEstado);
  }

  listar = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const contratos = await this.getAll.execute();
      res.json({ data: contratos });
    } catch (e) { next(e); }
  };

  obtener = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const contrato = await this.getById.execute(Number(req.params.id));
      res.json({ data: contrato });
    } catch (e) { next(e); }
  };

  // POST /api/contratos/desde-evento/:idEvento
  generarDesdeEvento = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = generarContratoSchema.parse(req.body);
      const contrato = await this.generar.execute({
        idEvento: Number(req.params.idEvento),
        ...input,
      });
      res.status(201).json({ data: contrato });
    } catch (e) { next(e); }
  };

  // PATCH /api/contratos/:id/estado
  cambiarEstado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = actualizarEstadoSchema.parse(req.body);
      const contrato = await this.actualizarEstado.execute(Number(req.params.id), input.idEstado);
      res.json({ data: contrato });
    } catch (e) { next(e); }
  };

  // DELETE /api/contratos/:id  →  transición a Cancelado (no borra registro)
  eliminar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const contrato = await this.cancelar.execute(Number(req.params.id));
      res.json({ data: contrato });
    } catch (e) { next(e); }
  };
}
