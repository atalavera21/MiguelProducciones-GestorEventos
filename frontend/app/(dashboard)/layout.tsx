// Layout compartido por todas las páginas del dashboard.
// Aquí irá la barra de navegación lateral y el header una vez que los construyamos.

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* TODO: Sidebar + Header */}
      <main>{children}</main>
    </div>
  );
}
