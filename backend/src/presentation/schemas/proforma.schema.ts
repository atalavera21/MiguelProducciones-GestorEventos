import { z } from 'zod';

// Los servicios de proforma son libres por diseño — JSONB en BD.
// Validamos que cada servicio tenga al menos los campos que el PDF necesita.
const servicioProforma = z.object({
  nombre:      z.string().min(1),
  descripcion: z.string(),
  entrega:     z.string(),
  precio:      z.number().nonnegative(),
});

export const crearProformaSchema = z.object({
  nombreCliente: z.string().min(1).max(150),
  tipoEvento:    z.string().min(1).max(100),
  fechaEvento:   z.coerce.date(),
  horario:       z.string().min(1).max(50),
  distrito:      z.string().min(1).max(100),
  referenciaDir: z.string().max(200).optional(),
  servicios:     z.array(servicioProforma).min(1, 'La proforma debe tener al menos un servicio'),
  total:         z.number().nonnegative(),
  adelanto:      z.number().nonnegative(),
});

export type CrearProformaInput = z.infer<typeof crearProformaSchema>;
