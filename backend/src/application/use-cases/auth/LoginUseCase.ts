import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { type IUsuarioRepository } from '../../../domain/repositories/IUsuarioRepository';
import { type UsuarioJWT } from '../../../domain/entities/Usuario';
import { UnauthorizedError, AppError } from '../../../shared/errors/AppError';

export interface LoginDto {
  alias: string;
  password: string;
}

export interface LoginResult {
  token: string;
  usuario: UsuarioJWT;
}

// Error genérico — no revela si el alias existe o no, evita enumeración de usuarios
const ERROR_CREDENCIALES = 'Alias o contraseña incorrectos';

export class LoginUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(dto: LoginDto): Promise<LoginResult> {
    const usuario = await this.usuarioRepository.findByAlias(dto.alias);

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedError(ERROR_CREDENCIALES);
    }

    const passwordValida = await bcrypt.compare(dto.password, usuario.passwordHash);
    if (!passwordValida) {
      throw new UnauthorizedError(ERROR_CREDENCIALES);
    }

    const payload: UsuarioJWT = {
      id:          usuario.id,
      alias:       usuario.alias,
      nombre:      usuario.nombre,
      rol:         usuario.rol,
      descripcion: usuario.descripcion,
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError('JWT_SECRET no configurado', 500);

    const token = jwt.sign(payload, secret, {
      expiresIn: (process.env.JWT_EXPIRES_IN ?? '8h') as jwt.SignOptions['expiresIn'],
    });

    return { token, usuario: payload };
  }
}
