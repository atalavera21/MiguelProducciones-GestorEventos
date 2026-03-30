import { type Request, type Response } from 'express';

import { GetAllEventos } from '../../application/use-cases/evento/GetAllEventos';
import { GetEventoById } from '../../application/use-cases/evento/GetEventoById';
import { CreateEvento } from '../../application/use-cases/evento/CreateEvento';
import { UpdateEvento } from '../../application/use-cases/evento/UpdateEvento';
import { DeleteEvento } from '../../application/use-cases/evento/DeleteEvento';
import { PrismaEventoRepository } from '../../infrastructure/repositories/PrismaEventoRepository';
import { PrismaClienteRepository } from '../../infrastructure/repositories/PrismaClienteRepository';
import { PrismaContratoRepository } from '../../infrastructure/repositories/PrismaContratoRepository';

export class EventoController {
  private readonly getAllEventos: GetAllEventos;
  private readonly getEventoById: GetEventoById;
  private readonly createEvento: CreateEvento;
  private readonly updateEvento: UpdateEvento;
  private readonly deleteEvento: DeleteEvento;

  constructor() {
    const eventoRepository    = new PrismaEventoRepository();
    const clienteRepository   = new PrismaClienteRepository();
    const contratoRepository  = new PrismaContratoRepository();

    this.getAllEventos  = new GetAllEventos(eventoRepository);
    this.getEventoById = new GetEventoById(eventoRepository);
    this.createEvento  = new CreateEvento(eventoRepository, clienteRepository);
    this.updateEvento  = new UpdateEvento(eventoRepository);
    // DeleteEvento necesita contratoRepository para verificar que no haya
    // un contrato activo antes de eliminar el evento
    this.deleteEvento  = new DeleteEvento(eventoRepository, contratoRepository);
  }

  // GET /api/eventos
  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const eventos = await this.getAllEventos.execute();
      res.json({ data: eventos });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los eventos' });
    }
  };

  // GET /api/eventos/:id
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const evento = await this.getEventoById.execute(Number(req.params.id));
      res.json({ data: evento });
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  };

  // POST /api/eventos
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const evento = await this.createEvento.execute(req.body);
      res.status(201).json({ data: evento });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // PATCH /api/eventos/:id
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const evento = await this.updateEvento.execute(Number(req.params.id), req.body);
      res.json({ data: evento });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // DELETE /api/eventos/:id
  remove = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.deleteEvento.execute(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  };
}
