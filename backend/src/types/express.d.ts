import { type UsuarioJWT } from '../domain/entities/Usuario';

declare global {
  namespace Express {
    interface Request {
      user?: UsuarioJWT;
    }
  }
}
