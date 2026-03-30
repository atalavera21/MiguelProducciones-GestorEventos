// Detalle específico del servicio de cuadro firma para un evento.
// Existe un registro por cada EventoServicio de tipo Cuadro Firma.
// La descripción captura las especificaciones acordadas con el cliente.

export interface DetalleCuadroFirma {
  id: number;
  idEventoServicio: number;
  descripcion: string; // Ej: "Cuadro 40x60 con marco dorado, 30 firmas"
}

export interface CrearDetalleCuadroFirmaDto {
  idEventoServicio: number;
  descripcion: string;
}
