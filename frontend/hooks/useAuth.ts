// Hook central de autenticación.
// Expone el usuario actual y su rol para que los componentes decidan qué renderizar.
// Ejemplo de uso:
//   const { usuario, rol, puedeEditar } = useAuth();
//   {puedeEditar && <Button>Nuevo evento</Button>}

import { useState, useEffect } from 'react';
import type { Usuario, Rol } from '../types';

interface AuthState {
  usuario: Usuario | null;
  rol: Rol | null;
  cargando: boolean;
  // viewer no puede crear, editar ni eliminar
  puedeEditar: boolean;
}

export function useAuth(): AuthState {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // TODO: leer el JWT del localStorage y decodificar el payload
    // Por ahora retorna null hasta que implementemos la autenticación
    setCargando(false);
  }, []);

  const rol = usuario?.rol ?? null;

  return {
    usuario,
    rol,
    cargando,
    puedeEditar: rol === 'admin' || rol === 'dueno',
  };
}
