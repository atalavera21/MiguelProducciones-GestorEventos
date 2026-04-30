import jwt from 'jsonwebtoken';
import { type UsuarioJWT } from '../../../domain/entities/Usuario';
import { AppError } from '../../../shared/errors/AppError';

export class RefreshTokenUseCase {
  execute(payload: UsuarioJWT): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError('JWT_SECRET no configurado', 500);

    const nuevoPayload: UsuarioJWT = {
      id:          payload.id,
      alias:       payload.alias,
      nombre:      payload.nombre,
      rol:         payload.rol,
      descripcion: payload.descripcion,
    };

    return jwt.sign(nuevoPayload, secret, {
      expiresIn: (process.env.JWT_EXPIRES_IN ?? '8h') as jwt.SignOptions['expiresIn'],
    });
  }
}
