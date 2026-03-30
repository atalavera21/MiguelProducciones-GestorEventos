// La proforma es un documento de cotización completamente independiente.
// No referencia ninguna otra tabla — puede hacerse para un cliente
// que aún no está registrado en el sistema.
//
// El campo servicios es un array libre: acepta cualquier combinación
// de servicios sin restricciones de esquema. En la BD se guarda como JSONB.

export interface ServicioProforma {
  nombre: string;       // Ej: "Fotografía Digital"
  descripcion: string;  // Ej: "Fotos ilimitadas · Edición incluida"
  entrega: string;      // Ej: "Link privado de descarga"
  precio: number;
}

export interface Proforma {
  id: number;
  nombreCliente: string;
  tipoEvento: string;    // Descripción libre — no FK a tipos_evento
  fechaEvento: Date;
  horario: string;       // Ej: "09:00 PM — 12:00 AM"
  distrito: string;
  referenciaDir?: string;
  servicios: ServicioProforma[];
  total: number;
  adelanto: number;      // Monto informativo de separación
  creadoEn: Date;
}

export interface CrearProformaDto {
  nombreCliente: string;
  tipoEvento: string;
  fechaEvento: Date;
  horario: string;
  distrito: string;
  referenciaDir?: string;
  servicios: ServicioProforma[];
  total: number;
  adelanto: number;
}
