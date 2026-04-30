import { type Usuario, type UsuarioPerfil } from '../entities/Usuario';

export interface IUsuarioRepository {
  findByAlias(alias: string): Promise<(Usuario & { passwordHash: string }) | null>;
  findById(id: number): Promise<UsuarioPerfil | null>;
}
