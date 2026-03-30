// Esta entidad representa a una persona que contrata los servicios
// de Miguel Producciones. Es TypeScript puro — no sabe que existe
// Prisma, Express ni ninguna otra tecnología.
//
// En .NET equivale a:
//   public class Cliente { ... }  en tu capa de Dominio,
//   sin [Table], sin DbContext, sin ningún atributo de EF Core.

export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;  // Canal principal: WhatsApp
  email?: string;    // Opcional — el ? equivale a string? en C#
  notas?: string;
  creadoEn: Date;
  actualizadoEn: Date;
}

// En lugar de usar la clase completa al crear un cliente nuevo,
// usamos un tipo separado que solo pide los campos que el usuario
// debe proveer. Los demás (id, fechas) los asigna el sistema.
//
// En .NET esto sería un record o un DTO de creación:
//   public record CrearClienteDto(string Nombre, string Telefono, ...);
export interface CrearClienteDto {
  nombre: string;
  telefono: string;
  email?: string;
  notas?: string;
}

export interface ActualizarClienteDto {
  nombre?: string;   // Todos opcionales — solo se actualiza lo que se envía
  telefono?: string;
  email?: string;
  notas?: string;
}
