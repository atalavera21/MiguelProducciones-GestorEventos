import { type IUsuarioRepository } from '../../../domain/repositories/IUsuarioRepository';
import { type UsuarioPerfil } from '../../../domain/entities/Usuario';
import { NotFoundError } from '../../../shared/errors/AppError';

export class GetMeUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(id: number): Promise<UsuarioPerfil> {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) throw new NotFoundError('Usuario no encontrado');
    return usuario;
  }
}
