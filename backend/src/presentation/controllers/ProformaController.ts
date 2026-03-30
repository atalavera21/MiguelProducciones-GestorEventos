import { type Request, type Response } from 'express';

import { CreateProforma } from '../../application/use-cases/proforma/CreateProforma';
import { GetProformaById } from '../../application/use-cases/proforma/GetProformaById';
import { DeleteProforma } from '../../application/use-cases/proforma/DeleteProforma';
import { PrismaProformaRepository } from '../../infrastructure/repositories/PrismaProformaRepository';

export class ProformaController {
  private readonly createProforma: CreateProforma;
  private readonly getProformaById: GetProformaById;
  private readonly deleteProforma: DeleteProforma;

  constructor() {
    const proformaRepository = new PrismaProformaRepository();

    this.createProforma  = new CreateProforma(proformaRepository);
    this.getProformaById = new GetProformaById(proformaRepository);
    this.deleteProforma  = new DeleteProforma(proformaRepository);
  }

  // POST /api/proformas
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const proforma = await this.createProforma.execute(req.body);
      res.status(201).json({ data: proforma });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // GET /api/proformas/:id
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const proforma = await this.getProformaById.execute(Number(req.params.id));
      res.json({ data: proforma });
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  };

  // DELETE /api/proformas/:id
  remove = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.deleteProforma.execute(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  };
}
