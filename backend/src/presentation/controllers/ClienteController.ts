import { type Request, type Response } from 'express';

import { GetAllClientes } from '../../application/use-cases/cliente/GetAllClientes';
import { GetClienteById } from '../../application/use-cases/cliente/GetClienteById';
import { CreateCliente } from '../../application/use-cases/cliente/CreateCliente';
import { UpdateCliente } from '../../application/use-cases/cliente/UpdateCliente';
import { DeleteCliente } from '../../application/use-cases/cliente/DeleteCliente';
import { PrismaClienteRepository } from '../../infrastructure/repositories/PrismaClienteRepository';

export class ClienteController {
  private readonly getAllClientes: GetAllClientes;
  private readonly getClienteById: GetClienteById;
  private readonly createCliente: CreateCliente;
  private readonly updateCliente: UpdateCliente;
  private readonly deleteCliente: DeleteCliente;

  constructor() {
    const clienteRepository = new PrismaClienteRepository();

    this.getAllClientes = new GetAllClientes(clienteRepository);
    this.getClienteById = new GetClienteById(clienteRepository);
    this.createCliente = new CreateCliente(clienteRepository);
    this.updateCliente = new UpdateCliente(clienteRepository);
    this.deleteCliente = new DeleteCliente(clienteRepository);
  }

  // GET /api/clientes
  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const clientes = await this.getAllClientes.execute();
      res.json({ data: clientes });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los clientes' });
    }
  };

  // GET /api/clientes/:id
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const cliente = await this.getClienteById.execute(Number(req.params.id));
      res.json({ data: cliente });
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  };

  // POST /api/clientes
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const cliente = await this.createCliente.execute(req.body);
      res.status(201).json({ data: cliente });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // PATCH /api/clientes/:id
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const cliente = await this.updateCliente.execute(Number(req.params.id), req.body);
      res.json({ data: cliente });
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  };

  // DELETE /api/clientes/:id
  remove = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.deleteCliente.execute(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  };
}
