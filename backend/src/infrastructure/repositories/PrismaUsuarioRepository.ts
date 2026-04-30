import prisma from '../database/prismaClient';
import { type IUsuarioRepository } from '../../domain/repositories/IUsuarioRepository';
import { type Usuario, type UsuarioPerfil, type RolUsuario } from '../../domain/entities/Usuario';

export class PrismaUsuarioRepository implements IUsuarioRepository {
  async findByAlias(alias: string): Promise<(Usuario & { passwordHash: string }) | null> {
    const usuario = await prisma.usuario.findUnique({ where: { alias } });
    if (!usuario) return null;
    return {
      id:           usuario.id,
      alias:        usuario.alias,
      nombre:       usuario.nombre,
      descripcion:  usuario.descripcion,
      rol:          usuario.rol as RolUsuario,
      activo:       usuario.activo,
      creadoEn:     usuario.creadoEn,
      passwordHash: usuario.passwordHash,
    };
  }

  async findById(id: number): Promise<UsuarioPerfil | null> {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: { id: true, alias: true, nombre: true, rol: true, descripcion: true },
    });
    if (!usuario) return null;
    return {
      id: usuario.id,
      alias: usuario.alias,
      nombre: usuario.nombre,
      rol: usuario.rol as RolUsuario,
      descripcion: usuario.descripcion,
    };
  }
}
