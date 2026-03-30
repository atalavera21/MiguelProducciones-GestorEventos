export enum EstadoContrato {
  BORRADOR = 'BORRADOR',
  ENVIADO = 'ENVIADO',
  FIRMADO = 'FIRMADO',
  CANCELADO = 'CANCELADO',
}

export interface Contrato {
  id: string;
  estado: EstadoContrato;
  montoTotal: number;
  montoAdelanto: number;
  tiempoCobertura: string;  // Ej: "8 horas"
  fotosIncluidas: number;
  condiciones?: string;
  pdfUrl?: string;           // URL en Supabase Storage — se llena cuando se genera el PDF
  eventoId: string;
  proformaId?: string;       // Opcional — puede existir sin proforma
  creadoEn: Date;
  actualizadoEn: Date;
}

export interface CrearContratoDto {
  montoTotal: number;
  montoAdelanto: number;
  tiempoCobertura: string;
  fotosIncluidas: number;
  eventoId: string;
  condiciones?: string;
  proformaId?: string;
}

export interface ActualizarContratoDto {
  estado?: EstadoContrato;
  montoTotal?: number;
  montoAdelanto?: number;
  tiempoCobertura?: string;
  fotosIncluidas?: number;
  condiciones?: string;
  pdfUrl?: string;
}
