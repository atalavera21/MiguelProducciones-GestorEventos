// Entidad del dominio — TypeScript puro, sin Prisma ni Express.
// Equivale a: public class Cliente { } en la capa de Dominio de .NET,
// sin [Table], sin DbContext, sin ningún atributo de EF Core.

// RangoEdad es una estimación visual para análisis de negocio,
// no se le pide el DNI al cliente para calcularla.
export enum RangoEdad {
  JOVEN  = '18-30',
  ADULTO = '30-45',
  MAYOR  = '45+',
}

export interface Cliente {
  id: number;           // SERIAL en PostgreSQL — entero autoincremental
  nombre: string;
  telefono: string;     // Canal principal: WhatsApp
  dni: string;          // Se usa en el contrato para identificación formal
  referencia?: string;  // Ej: "Referido por García", "Facebook", "Instagram"
  sexo: boolean;        // true = masculino / false = femenino
  rangoEdad: RangoEdad;
  activo: boolean;      // false = cliente archivado, no aparece en listas activas
}

// Solo los campos que el usuario ingresa al registrar un cliente.
// id y activo los asigna el sistema por defecto.
// Equivale a un record de creación en .NET: public record CrearClienteDto(...)
export interface CrearClienteDto {
  nombre: string;
  telefono: string;
  dni: string;
  referencia?: string;
  sexo: boolean;
  rangoEdad: RangoEdad;
}

export interface ActualizarClienteDto {
  nombre?: string;
  telefono?: string;
  dni?: string;
  referencia?: string;
  sexo?: boolean;
  rangoEdad?: RangoEdad;
  activo?: boolean;
}
