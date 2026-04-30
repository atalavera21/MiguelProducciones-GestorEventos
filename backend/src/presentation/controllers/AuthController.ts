import { type Request, type Response, type NextFunction } from 'express';
import { LoginUseCase } from '../../application/use-cases/auth/LoginUseCase';
import { GetMeUseCase } from '../../application/use-cases/auth/GetMeUseCase';
import { RefreshTokenUseCase } from '../../application/use-cases/auth/RefreshTokenUseCase';
import { PrismaUsuarioRepository } from '../../infrastructure/repositories/PrismaUsuarioRepository';
import { loginSchema } from '../schemas/auth.schema';

export class AuthController {
  private readonly loginUseCase: LoginUseCase;
  private readonly getMeUseCase: GetMeUseCase;
  private readonly refreshTokenUseCase: RefreshTokenUseCase;

  constructor() {
    const usuarioRepository = new PrismaUsuarioRepository();
    this.loginUseCase = new LoginUseCase(usuarioRepository);
    this.getMeUseCase = new GetMeUseCase(usuarioRepository);
    this.refreshTokenUseCase = new RefreshTokenUseCase();
  }

  // POST /api/auth/login
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = loginSchema.parse(req.body);
      const resultado = await this.loginUseCase.execute(input);
      res.json({ data: resultado });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/auth/me — requiere authMiddleware
  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const usuario = await this.getMeUseCase.execute(req.user!.id);
      res.json({ data: usuario });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/auth/refresh — requiere authMiddleware
  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = this.refreshTokenUseCase.execute(req.user!);
      res.json({ data: { token } });
    } catch (error) {
      next(error);
    }
  };
}
