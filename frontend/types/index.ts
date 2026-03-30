// Tipos que espeja el dominio del backend.
// Se actualizan aquí cuando el contrato de la API cambia.

export type Rol = 'admin' | 'dueno' | 'viewer';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
}

export type RangoEdad = '18-30' | '30-45' | '45+';

export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  dni: string;
  referencia?: string;
  sexo: boolean;
  rangoEdad: RangoEdad;
  activo: boolean;
}

export interface TipoEvento {
  id: number;
  nombre: string;
}

export interface TipoServicio {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface EstadoContrato {
  id: number;
  nombre: string;
}

export interface Evento {
  id: number;
  idCliente: number;
  idTipoEvento: number;
  direccion: string;
  fechaHora: string;
  notas?: string;
}

export type MetodoPago = 'EFECTIVO' | 'YAPE' | 'TRANSFERENCIA';

export interface Contrato {
  id: number;
  idEvento: number;
  idEstado: number;
  nombreCliente: string;
  dniCliente: string;
  telefonoCliente: string;
  tipoEvento: string;
  direccionEvento: string;
  fechaHoraEvento: string;
  montoTotal: number;
  montoAdelanto: number;
  saldo: number;
  metodoPago: MetodoPago;
  cuentaPago: string;
  dniFotografo: string;
  fechaContrato: string;
  pdfUrl?: string;
}

export interface ServicioProforma {
  nombre: string;
  descripcion?: string;
  precio: number;
}

export interface Proforma {
  id: number;
  nombreCliente: string;
  tipoEvento: string;
  fechaEvento: string;
  horario: string;
  distrito: string;
  referenciaDir?: string;
  servicios: ServicioProforma[];
  total: number;
  adelanto: number;
  creadoEn: string;
}
