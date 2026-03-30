import { type Request, type Response } from 'express';

import { PrismaTipoEventoRepository } from '../../infrastructure/repositories/PrismaTipoEventoRepository';
import { PrismaTipoServicioRepository } from '../../infrastructure/repositories/PrismaTipoServicioRepository';
import { PrismaEstadoContratoRepository } from '../../infrastructure/repositories/PrismaEstadoContratoRepository';

// Los catálogos son datos de referencia que el frontend necesita
// para poblar selectores y checkboxes (tipos de evento, servicios, estados).
// Son de solo lectura — no hay creación ni eliminación desde la app.

export class CatalogoController {
  private readonly tipoEventoRepo    = new PrismaTipoEventoRepository();
  private readonly tipoServicioRepo  = new PrismaTipoServicioRepository();
  private readonly estadoContratoRepo = new PrismaEstadoContratoRepository();

  // GET /api/catalogos/tipos-evento
  getTiposEvento = async (_req: Request, res: Response): Promise<void> => {
    try {
      const tipos = await this.tipoEventoRepo.findActivos();
      res.json({ data: tipos });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener tipos de evento' });
    }
  };

  // GET /api/catalogos/tipos-servicio
  getTiposServicio = async (_req: Request, res: Response): Promise<void> => {
    try {
      const tipos = await this.tipoServicioRepo.findActivos();
      res.json({ data: tipos });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener tipos de servicio' });
    }
  };

  // GET /api/catalogos/estados-contrato
  getEstadosContrato = async (_req: Request, res: Response): Promise<void> => {
    try {
      const estados = await this.estadoContratoRepo.findAll();
      res.json({ data: estados });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener estados de contrato' });
    }
  };
}
