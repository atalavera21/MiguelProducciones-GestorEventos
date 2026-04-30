import { type Request, type Response, type NextFunction } from 'express';

import { CreateProforma } from '../../application/use-cases/proforma/CreateProforma';
import { GetProformaById } from '../../application/use-cases/proforma/GetProformaById';
import { DeleteProforma } from '../../application/use-cases/proforma/DeleteProforma';
import { PrismaProformaRepository } from '../../infrastructure/repositories/PrismaProformaRepository';
import { crearProformaSchema } from '../schemas/proforma.schema';

export class ProformaController {
  private readonly create: CreateProforma;
  private readonly getById: GetProformaById;
  private readonly delete_: DeleteProforma;

  constructor() {
    const repo = new PrismaProformaRepository();
    this.create  = new CreateProforma(repo);
    this.getById = new GetProformaById(repo);
    this.delete_ = new DeleteProforma(repo);
  }

  obtener = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const proforma = await this.getById.execute(Number(req.params.id));
      res.json({ data: proforma });
    } catch (e) { next(e); }
  };

  crear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = crearProformaSchema.parse(req.body);
      const proforma = await this.create.execute(input);
      res.status(201).json({ data: proforma });
    } catch (e) { next(e); }
  };

  eliminar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.delete_.execute(Number(req.params.id));
      res.status(204).send();
    } catch (e) { next(e); }
  };
}
