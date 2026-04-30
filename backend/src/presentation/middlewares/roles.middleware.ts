import { type Request, type Response, type NextFunction } from 'express';
import { type RolUsuario } from '../../domain/entities/Usuario';

export function rolesMiddleware(rolesPermitidos: RolUsuario[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const usuario = req.user;
    if (!usuario) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }
    if (!rolesPermitidos.includes(usuario.rol)) {
      res.status(403).json({ error: 'No tienes permiso para esta acción' });
      return;
    }
    next();
  };
}
