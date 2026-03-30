import { type TipoEvento } from '../entities/TipoEvento';

// Catálogo de solo lectura desde la perspectiva de la app.
// Los registros se crean por seed. El admin puede activar/desactivar
// pero no es una operación frecuente — no necesita CRUD completo.

export interface ITipoEventoRepository {
  findById(id: number): Promise<TipoEvento | null>;
  findAll(): Promise<TipoEvento[]>;
  findActivos(): Promise<TipoEvento[]>; // Los que aparecen en el formulario
}
