import { z } from 'zod';

export const loginSchema = z.object({
  alias:    z.string().min(1, 'El alias es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export type LoginInput = z.infer<typeof loginSchema>;
