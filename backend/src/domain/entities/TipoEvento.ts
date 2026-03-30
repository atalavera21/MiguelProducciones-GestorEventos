// Catálogo de tipos de evento administrable desde el sistema.
// Al ser una tabla en la BD (no un enum fijo), se pueden agregar
// o desactivar tipos sin necesidad de cambiar código ni hacer deploy.
//
// Equivale a una tabla de lookup en .NET con un repositorio propio.

export interface TipoEvento {
  id: number;
  nombre: string;   // Ej: Boda, Quinceañera, Bautizo, Cumpleaños
  activo: boolean;  // false = no aparece en el formulario, pero se conserva para historial
}
