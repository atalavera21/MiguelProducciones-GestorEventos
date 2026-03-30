export interface Proforma {
  id: string;
  montoTotal: number;
  descripcion?: string;
  notas?: string;
  eventoId: string;
  creadoEn: Date;
}

export interface CrearProformaDto {
  montoTotal: number;
  eventoId: string;
  descripcion?: string;
  notas?: string;
}
