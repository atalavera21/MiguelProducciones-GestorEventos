import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { type UsuarioJWT } from '../../domain/entities/Usuario';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token de autenticación requerido' });
    return;
  }

  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ error: 'Error de configuración del servidor' });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as UsuarioJWT;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}
