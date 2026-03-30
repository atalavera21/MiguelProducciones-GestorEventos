import { type Request, type Response } from 'express';

import { GetAllEventos } from '../../application/use-cases/evento/GetAllEventos';
import { GetEventoById } from '../../application/use-cases/evento/GetEventoById';
import { CreateEvento } from '../../application/use-cases/evento/CreateEvento';
import { UpdateEvento } from '../../application/use-cases/evento/UpdateEvento';
import { DeleteEvento } from '../../application/use-cases/evento/DeleteEvento';
import { PrismaEventoRepository } from '../../infrastructure/repositories/PrismaEventoRepository';
import { PrismaClienteRepository } from '../../infrastructure/repositories/PrismaClienteRepository';

export class EventoController {
  private readonly getAllEventos: GetAllEventos;
  private readonly getEventoById: GetEventoById;
  private readonly createEvento: CreateEvento;
  private readonly updateEvento: UpdateEvento;
  private readonly deleteEvento: DeleteEvento;

  constructor() {
    const eventoRepository = new PrismaEventoRepository();
    const clienteRepository = new PrismaClienteRepository();

    this.getAllEventos = new GetAllEventos(eventoRepository);
    this.getEventoById = new GetEventoById(eventoRepository);
    // CreateEvento necesita ambos repositorios para validar que el cliente existe
    this.createEvento = new CreateEvento(eventoRepository, clienteRepository);
    this.updateEvento = new UpdateEvento(eventoRepository);
    this.deleteEvento = new DeleteEvento(eventoRepository);
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
      const evento = await this.getEventoById.execute(req.params.id as string);
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
      const evento = await this.updateEvento.execute(req.params.id as string, req.body);
      res.json({ data: evento });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // DELETE /api/eventos/:id
  remove = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.deleteEvento.execute(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  };
}
