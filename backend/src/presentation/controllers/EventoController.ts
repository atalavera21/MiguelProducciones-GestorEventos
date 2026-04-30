import { type Request, type Response, type NextFunction } from 'express';

import { GetAllEventos } from '../../application/use-cases/evento/GetAllEventos';
import { GetEventoById } from '../../application/use-cases/evento/GetEventoById';
import { CreateEvento } from '../../application/use-cases/evento/CreateEvento';
import { UpdateEvento } from '../../application/use-cases/evento/UpdateEvento';
import { DeleteEvento } from '../../application/use-cases/evento/DeleteEvento';
import { PrismaEventoRepository } from '../../infrastructure/repositories/PrismaEventoRepository';
import { PrismaClienteRepository } from '../../infrastructure/repositories/PrismaClienteRepository';
import { PrismaContratoRepository } from '../../infrastructure/repositories/PrismaContratoRepository';
import { crearEventoSchema, actualizarEventoSchema } from '../schemas/evento.schema';

export class EventoController {
  private readonly getAll: GetAllEventos;
  private readonly getById: GetEventoById;
  private readonly create: CreateEvento;
  private readonly update: UpdateEvento;
  private readonly delete_: DeleteEvento;

  constructor() {
    const eventoRepo   = new PrismaEventoRepository();
    const clienteRepo  = new PrismaClienteRepository();
    const contratoRepo = new PrismaContratoRepository();

    this.getAll  = new GetAllEventos(eventoRepo);
    this.getById = new GetEventoById(eventoRepo);
    this.create  = new CreateEvento(eventoRepo, clienteRepo);
    this.update  = new UpdateEvento(eventoRepo);
    this.delete_ = new DeleteEvento(eventoRepo, contratoRepo);
  }

  listar = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventos = await this.getAll.execute();
      res.json({ data: eventos });
    } catch (e) { next(e); }
  };

  obtener = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const evento = await this.getById.execute(Number(req.params.id));
      res.json({ data: evento });
    } catch (e) { next(e); }
  };

  crear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = crearEventoSchema.parse(req.body);
      const evento = await this.create.execute(input);
      res.status(201).json({ data: evento });
    } catch (e) { next(e); }
  };

  actualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = actualizarEventoSchema.parse(req.body);
      const evento = await this.update.execute(Number(req.params.id), input);
      res.json({ data: evento });
    } catch (e) { next(e); }
  };

  eliminar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.delete_.execute(Number(req.params.id));
      res.status(204).send();
    } catch (e) { next(e); }
  };
}
