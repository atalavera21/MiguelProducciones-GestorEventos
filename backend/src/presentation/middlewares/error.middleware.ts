import { type Request, type Response, type NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../../shared/errors/AppError';

// Error handler global de Express. Cualquier error propagado con next(error)
// llega aquí. Mapea cada tipo a su statusCode y devuelve respuesta uniforme.
//
// Formato de respuesta:
//   { error: string, code?: string, details?: unknown }
//
// El cuarto parámetro `_next` es obligatorio para que Express identifique
// esta función como error middleware aunque no se use.
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Errores de validación de Zod — explotan el primer issue para mensaje legible
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Datos de entrada inválidos',
      code: 'VALIDATION_ERROR',
      details: err.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      })),
    });
    return;
  }

  // Errores de dominio
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
    return;
  }

  // Cualquier otra cosa = bug. Registrar y devolver 500 sin filtrar internals en producción.
  console.error('[errorHandler] Error no manejado:', err);
  const isDev = process.env.NODE_ENV !== 'production';
  res.status(500).json({
    error: isDev ? err.message : 'Error interno del servidor',
    code: 'INTERNAL_ERROR',
  });
}
