export interface Usuario {
  id: number;
  alias: string;
  nombre: string;
  descripcion?: string | null;
  rol: RolUsuario;
  activo: boolean;
  creadoEn: Date;
}

export type RolUsuario = 'ADMIN' | 'DUENO' | 'VIEWER';

// Payload que se guarda en el JWT.
// Incluye descripcion para que el frontend tenga toda la info al loguear,
// sin necesidad de un GET /auth/me adicional tras el login.
export interface UsuarioJWT {
  id: number;
  alias: string;
  nombre: string;
  rol: RolUsuario;
  descripcion?: string | null;
}

// Lo que devuelve GET /api/auth/me
export interface UsuarioPerfil {
  id: number;
  alias: string;
  nombre: string;
  rol: RolUsuario;
  descripcion?: string | null;
}
