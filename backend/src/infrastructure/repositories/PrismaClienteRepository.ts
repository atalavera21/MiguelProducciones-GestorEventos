import { type Cliente, type CrearClienteDto, type ActualizarClienteDto } from '../../domain/entities/Cliente';
import { type IClienteRepository } from '../../domain/repositories/IClienteRepository';
import prisma from '../database/prismaClient';

// Esta clase implementa el contrato IClienteRepository usando Prisma.
//
// En .NET equivale a:
//   public class ClienteRepository : IClienteRepository {
//       private readonly AppDbContext _context;
//       ...
//   }
//
// La diferencia clave: los casos de uso en Application nunca importan esta clase.
// Solo conocen la interfaz IClienteRepository. Esta clase es un detalle de
// implementación que solo conoce la capa de infraestructura.

export class PrismaClienteRepository implements IClienteRepository {

  async findAll(): Promise<Cliente[]> {
    // prisma.cliente.findMany() equivale a:
    //   _context.Clientes.ToListAsync()  en EF Core
    const clientes = await prisma.cliente.findMany({
      orderBy: { creadoEn: 'desc' }, // Los más nuevos primero
    });

    // Prisma devuelve sus propios tipos generados. Los mapeamos a nuestra
    // entidad de dominio para que la capa Application no dependa de los
    // tipos de Prisma.
    //
    // En .NET harías esto con AutoMapper o un método ToDto().
    return clientes.map(this.toDomain);
  }

  async findById(id: string): Promise<Cliente | null> {
    // findUnique() busca exactamente un registro por un campo único.
    // Equivale a: _context.Clientes.FirstOrDefaultAsync(c => c.Id == id)
    const cliente = await prisma.cliente.findUnique({
      where: { id },
    });

    if (!cliente) return null;
    return this.toDomain(cliente);
  }

  async create(dto: CrearClienteDto): Promise<Cliente> {
    // prisma.cliente.create() equivale a:
    //   _context.Clientes.Add(entidad);
    //   await _context.SaveChangesAsync();
    // Prisma hace el Add + SaveChanges en un solo paso.
    const cliente = await prisma.cliente.create({
      data: {
        nombre: dto.nombre,
        telefono: dto.telefono,
        email: dto.email,
        notas: dto.notas,
      },
    });

    return this.toDomain(cliente);
  }

  async update(id: string, dto: ActualizarClienteDto): Promise<Cliente | null> {
    try {
      // prisma.cliente.update() equivale a:
      //   _context.Clientes.Update(entidad);
      //   await _context.SaveChangesAsync();
      const cliente = await prisma.cliente.update({
        where: { id },
        data: dto, // Solo actualiza los campos que vienen en el dto
      });

      return this.toDomain(cliente);
    } catch {
      // Prisma lanza un error específico si el registro no existe.
      // Lo capturamos y devolvemos null para que el caso de uso lo maneje.
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.cliente.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  // Método privado que convierte el tipo de Prisma al tipo de nuestro dominio.
  // Esto se llama "mapeo" y es importante porque desacopla Prisma del dominio.
  // Si mañana cambiamos el nombre de un campo en Prisma, solo cambiamos aquí.
  private toDomain(prismaCliente: {
    id: string;
    nombre: string;
    telefono: string;
    email: string | null;
    notas: string | null;
    creadoEn: Date;
    actualizadoEn: Date;
  }): Cliente {
    return {
      id: prismaCliente.id,
      nombre: prismaCliente.nombre,
      telefono: prismaCliente.telefono,
      // Convertimos null de Prisma a undefined del dominio
      // null y undefined son distintos en TypeScript:
      // - null: "existe pero está vacío"
      // - undefined: "el campo simplemente no está presente"
      // Nuestro dominio usa undefined para opcionales, Prisma usa null.
      email: prismaCliente.email ?? undefined,
      notas: prismaCliente.notas ?? undefined,
      creadoEn: prismaCliente.creadoEn,
      actualizadoEn: prismaCliente.actualizadoEn,
    };
  }
}
