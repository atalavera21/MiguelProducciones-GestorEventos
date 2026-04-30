import { z } from 'zod';
import { MetodoPago } from '../../domain/entities/Contrato';

const metodoPago = z.nativeEnum(MetodoPago);

// El cliente solo envía los campos del acuerdo. Los datos desnormalizados
// (nombre cliente, tipo evento, monto total, etc.) los calcula el use case
// GenerarContrato a partir del evento y sus servicios.
export const generarContratoSchema = z.object({
  metodoPago:    metodoPago,
  cuentaPago:    z.string().min(1).max(100),
  dniFotografo: z.string().min(1).max(12),
  fechaContrato: z.coerce.date(),
  montoAdelanto: z.number().nonnegative(),
});

export const actualizarEstadoSchema = z.object({
  idEstado: z.number().int().positive(),
});

export type GenerarContratoInput = z.infer<typeof generarContratoSchema>;
export type ActualizarEstadoInput = z.infer<typeof actualizarEstadoSchema>;
