// Catálogo de servicios que ofrece Miguel Producciones.
// Igual que TipoEvento: administrable sin cambiar código.
//
// Servicios iniciales (seed):
//   1 = Fotografía
//   2 = Filmación
//   3 = Cuadro Firma

export interface TipoServicio {
  id: number;
  nombre: string;        // Ej: Fotografía, Filmación, Cuadro Firma
  descripcion?: string;
  activo: boolean;
}
