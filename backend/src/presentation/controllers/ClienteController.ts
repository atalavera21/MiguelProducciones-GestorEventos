import { type Request, type Response } from 'express';

import { GetAllClientes } from '../../application/use-cases/cliente/GetAllClientes';
import { GetClienteById } from '../../application/use-cases/cliente/GetClienteById';
import { CreateCliente } from '../../application/use-cases/cliente/CreateCliente';
import { UpdateCliente } from '../../application/use-cases/cliente/UpdateCliente';
import { DeleteCliente } from '../../application/use-cases/cliente/DeleteCliente';
import { PrismaClienteRepository } from '../../infrastructure/repositories/PrismaClienteRepository';

// El controller hace UNA sola cosa: traducir HTTP ↔ casos de uso.
// No tiene lógica de negocio. Solo:
//   1. Lee los datos del request (params, body, query)
//   2. Llama al caso de uso correspondiente
//   3. Devuelve la respuesta HTTP correcta
//
// En .NET equivale a tu ApiController, pero sin el sistema de DI automático.
// Aquí instanciamos las dependencias a mano en el constructor.

export class ClienteController {
  // Los casos de uso se crean con su repositorio concreto.
  // En .NET esto lo hace el DI container automáticamente.
  // Aquí lo hacemos explícito — lo que en arquitectura se llama
  // "Composition Root": el punto donde conectamos interfaces con implementaciones.
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
      const cliente = await this.getClienteById.execute(req.params.id as string);
      res.json({ data: cliente });
    } catch (error) {
      // El caso de uso lanza un Error cuando no encuentra el cliente.
      // Lo capturamos y devolvemos 404.
      res.status(404).json({ error: (error as Error).message });
    }
  };

  // POST /api/clientes
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const cliente = await this.createCliente.execute(req.body);
      // 201 Created — el estándar HTTP para recursos creados exitosamente
      res.status(201).json({ data: cliente });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // PATCH /api/clientes/:id
  // Usamos PATCH (actualización parcial) en lugar de PUT (reemplazo completo).
  // En .NET también es buena práctica: PATCH para actualizaciones parciales.
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const cliente = await this.updateCliente.execute(req.params.id as string, req.body);
      res.json({ data: cliente });
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  };

  // DELETE /api/clientes/:id
  remove = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.deleteCliente.execute(req.params.id as string);
      // 204 No Content — el estándar HTTP para eliminaciones exitosas (sin body)
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  };
}
