import { z } from 'zod';
import { RangoEdad } from '../../domain/entities/Cliente';

// Los valores que viajan por la API son los strings del dominio
// ('18-30' | '30-45' | '45+'), no los nombres del enum (JOVEN/ADULTO/MAYOR).
// nativeEnum acepta los valores del enum y mantiene la compatibilidad con CrearClienteDto.
const rangoEdadEnum = z.nativeEnum(RangoEdad);

export const crearClienteSchema = z.object({
  nombre:     z.string().min(1).max(150),
  telefono:   z.string().min(1).max(30),
  dni:        z.string().min(1).max(12),
  referencia: z.string().max(200).optional(),
  sexo:       z.boolean(),
  rangoEdad:  rangoEdadEnum,
});

// Todos los campos opcionales — actualización parcial con PATCH
export const actualizarClienteSchema = crearClienteSchema.partial().extend({
  activo: z.boolean().optional(),
});

export type CrearClienteInput = z.infer<typeof crearClienteSchema>;
export type ActualizarClienteInput = z.infer<typeof actualizarClienteSchema>;
