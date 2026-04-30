import { z } from 'zod';

const detalleFotografiaSchema = z.object({
  esDigital:  z.boolean().default(true),
  esFisica:   z.boolean().default(false),
  tipoPapel:  z.enum(['BRILLO', 'MATE']).nullable().optional(),
  notas:      z.string().max(300).nullable().optional(),
});

const detalleFilmacionSchema = z.object({
  incluyeHighlight: z.boolean().default(true),
  notas:            z.string().max(300).nullable().optional(),
});

const detalleCuadroFirmaSchema = z.object({
  descripcion: z.string().min(1).max(300),
});

const servicioEventoSchema = z.object({
  idTipoServicio:    z.number().int().positive(),
  precio:            z.number().positive(),
  detalleFotografia: detalleFotografiaSchema.optional(),
  detalleFilmacion:  detalleFilmacionSchema.optional(),
  detalleCuadroFirma: detalleCuadroFirmaSchema.optional(),
});

// z.coerce.date() acepta tanto strings ISO como instancias Date — necesario
// porque el body llega como JSON (string) pero el dominio usa Date.
export const crearEventoSchema = z.object({
  idCliente:    z.number().int().positive(),
  idTipoEvento: z.number().int().positive(),
  direccion:    z.string().min(1).max(300),
  fechaHora:    z.coerce.date(),
  notas:        z.string().optional(),
  servicios:    z.array(servicioEventoSchema).optional().default([]),
});

export const actualizarEventoSchema = z.object({
  idTipoEvento: z.number().int().positive().optional(),
  direccion:    z.string().min(1).max(300).optional(),
  fechaHora:    z.coerce.date().optional(),
  notas:        z.string().optional(),
});

export type CrearEventoInput    = z.infer<typeof crearEventoSchema>;
export type ActualizarEventoInput = z.infer<typeof actualizarEventoSchema>;
