// El contrato desnormaliza los datos del cliente y del evento
// al momento de su creación. Esto garantiza que el PDF refleje
// el acuerdo exactamente como fue firmado, aunque después se
// edite el cliente o el evento. Equivale a un snapshot en el tiempo.
//
// En .NET sería similar a un Value Object que congela el estado.

export enum MetodoPago {
  EFECTIVO      = 'EFECTIVO',
  YAPE          = 'YAPE',
  TRANSFERENCIA = 'TRANSFERENCIA',
}

export interface Contrato {
  id: number;
  idEvento: number;   // FK → eventos (referencia de origen, para trazabilidad)
  idEstado: number;   // FK → estados_contrato (catálogo: Pendiente, Activo, etc.)

  // Datos del cliente — copiados al momento de la firma
  nombreCliente: string;
  dniCliente: string;
  telefonoCliente: string;

  // Datos del evento — copiados al momento de la firma
  tipoEvento: string;
  direccionEvento: string;
  fechaHoraEvento: Date;

  // Montos en Soles (PEN)
  montoTotal: number;
  montoAdelanto: number;
  saldo: number;        // saldo = montoTotal - montoAdelanto

  // Pago
  metodoPago: MetodoPago;
  cuentaPago: string;   // Número de cuenta, número de Yape, etc.

  // Firma
  dniFotografo: string; // DNI del representante de Miguel Producciones
  fechaContrato: Date;
  pdfUrl?: string;      // URL permanente en Supabase Storage — se llena al generar el PDF
}

// Solo se necesita el idEvento — el use case consulta el evento,
// el cliente y los servicios, y construye el contrato completo.
export interface CrearContratoDto {
  idEvento: number;
  metodoPago: MetodoPago;
  cuentaPago: string;
  dniFotografo: string;
  fechaContrato: Date;
  montoAdelanto: number;
}

export interface ActualizarContratoDto {
  idEstado?: number;
  pdfUrl?: string;
}
