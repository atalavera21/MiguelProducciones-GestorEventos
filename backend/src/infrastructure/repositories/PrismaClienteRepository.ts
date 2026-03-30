import { type Cliente, type CrearClienteDto, type ActualizarClienteDto, RangoEdad } from '../../domain/entities/Cliente';
import { type IClienteRepository } from '../../domain/repositories/IClienteRepository';
import prisma from '../database/prismaClient';

// Prisma almacena RangoEdad como 'JOVEN' | 'ADULTO' | 'MAYOR' (el nombre del enum).
// Nuestro dominio usa '18-30' | '30-45' | '45+' (el valor del enum).
// Estos mapas traducen entre ambas representaciones.
const PRISMA_A_DOMINIO: Record<string, RangoEdad> = {
  JOVEN:  RangoEdad.JOVEN,
  ADULTO: RangoEdad.ADULTO,
  MAYOR:  RangoEdad.MAYOR,
};

const DOMINIO_A_PRISMA: Record<RangoEdad, string> = {
  [RangoEdad.JOVEN]:  'JOVEN',
  [RangoEdad.ADULTO]: 'ADULTO',
  [RangoEdad.MAYOR]:  'MAYOR',
};

export class PrismaClienteRepository implements IClienteRepository {

  async findAll(): Promise<Cliente[]> {
    const clientes = await prisma.cliente.findMany({
      orderBy: { nombre: 'asc' },
    });
    return clientes.map(this.toDomain);
  }

  async findActivos(): Promise<Cliente[]> {
    const clientes = await prisma.cliente.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    });
    return clientes.map(this.toDomain);
  }

  async findById(id: number): Promise<Cliente | null> {
    const cliente = await prisma.cliente.findUnique({ where: { id } });
    if (!cliente) return null;
    return this.toDomain(cliente);
  }

  async create(dto: CrearClienteDto): Promise<Cliente> {
    const cliente = await prisma.cliente.create({
      data: {
        nombre:     dto.nombre,
        telefono:   dto.telefono,
        dni:        dto.dni,
        referencia: dto.referencia,
        sexo:       dto.sexo,
        rangoEdad:  DOMINIO_A_PRISMA[dto.rangoEdad] as any,
      },
    });
    return this.toDomain(cliente);
  }

  async update(id: number, dto: ActualizarClienteDto): Promise<Cliente | null> {
    try {
      const cliente = await prisma.cliente.update({
        where: { id },
        data: {
          ...dto,
          // Si viene rangoEdad en el dto, lo convertimos antes de persistir
          rangoEdad: dto.rangoEdad
            ? (DOMINIO_A_PRISMA[dto.rangoEdad] as any)
            : undefined,
        },
      });
      return this.toDomain(cliente);
    } catch {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.cliente.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  // Convierte el tipo de Prisma al tipo de dominio.
  // Prisma devuelve null para campos opcionales — el dominio usa undefined.
  private toDomain(p: {
    id: number;
    nombre: string;
    telefono: string;
    dni: string;
    referencia: string | null;
    sexo: boolean;
    rangoEdad: string;
    activo: boolean;
  }): Cliente {
    return {
      id:         p.id,
      nombre:     p.nombre,
      telefono:   p.telefono,
      dni:        p.dni,
      referencia: p.referencia ?? undefined,
      sexo:       p.sexo,
      rangoEdad:  PRISMA_A_DOMINIO[p.rangoEdad],
      activo:     p.activo,
    };
  }
}
