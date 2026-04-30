import { type Request, type Response, type NextFunction } from 'express';

import { GetAllClientes } from '../../application/use-cases/cliente/GetAllClientes';
import { GetClienteById } from '../../application/use-cases/cliente/GetClienteById';
import { CreateCliente } from '../../application/use-cases/cliente/CreateCliente';
import { UpdateCliente } from '../../application/use-cases/cliente/UpdateCliente';
import { DeleteCliente } from '../../application/use-cases/cliente/DeleteCliente';
import { PrismaClienteRepository } from '../../infrastructure/repositories/PrismaClienteRepository';
import { crearClienteSchema, actualizarClienteSchema } from '../schemas/cliente.schema';

export class ClienteController {
  private readonly getAll: GetAllClientes;
  private readonly getById: GetClienteById;
  private readonly create: CreateCliente;
  private readonly update: UpdateCliente;
  private readonly delete_: DeleteCliente;

  constructor() {
    const repo = new PrismaClienteRepository();
    this.getAll  = new GetAllClientes(repo);
    this.getById = new GetClienteById(repo);
    this.create  = new CreateCliente(repo);
    this.update  = new UpdateCliente(repo);
    this.delete_ = new DeleteCliente(repo);
  }

  listar = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const clientes = await this.getAll.execute();
      res.json({ data: clientes });
    } catch (e) { next(e); }
  };

  obtener = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cliente = await this.getById.execute(Number(req.params.id));
      res.json({ data: cliente });
    } catch (e) { next(e); }
  };

  crear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = crearClienteSchema.parse(req.body);
      const cliente = await this.create.execute(input);
      res.status(201).json({ data: cliente });
    } catch (e) { next(e); }
  };

  actualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = actualizarClienteSchema.parse(req.body);
      const cliente = await this.update.execute(Number(req.params.id), input);
      res.json({ data: cliente });
    } catch (e) { next(e); }
  };

  eliminar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.delete_.execute(Number(req.params.id));
      res.status(204).send();
    } catch (e) { next(e); }
  };
}
