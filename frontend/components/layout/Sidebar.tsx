'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { href: '/agenda',    label: 'Agenda' },
  { href: '/clientes',  label: 'Clientes' },
  { href: '/proformas', label: 'Proformas' },
  { href: '/contratos', label: 'Contratos' },
  { href: '/analisis',  label: 'Análisis' },
] as const;

const ROL_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  DUENO: 'Dueño',
  VIEWER: 'Vista',
};

const ROL_CLASES: Record<string, string> = {
  ADMIN: 'bg-primary/10 text-primary border border-primary/20',
  DUENO: 'bg-info/10 text-info border border-info/20',
  VIEWER: 'bg-warning/10 text-warning border border-warning/20',
};

export function Sidebar() {
  const pathname = usePathname();
  const { usuario, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-bg-surface border-r border-border flex flex-col z-10">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-border">
        <span className="text-primary font-bold text-base leading-tight block">
          Miguel Producciones
        </span>
        <span className="text-text-secondary text-xs mt-0.5 block">Gestión de eventos</span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const activo = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activo
                  ? 'bg-primary-muted text-primary'
                  : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Pie — usuario y cierre de sesión */}
      {usuario && (
        <div className="px-4 py-4 border-t border-border">
          <p className="text-text-primary text-sm font-medium truncate">{usuario.nombre}</p>
          <span
            className={`inline-block text-xs px-2 py-0.5 rounded-sm mt-1 ${ROL_CLASES[usuario.rol] ?? ''}`}
          >
            {ROL_LABELS[usuario.rol] ?? usuario.rol}
          </span>
          <button
            onClick={logout}
            className="mt-3 text-danger text-sm hover:underline block"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </aside>
  );
}
