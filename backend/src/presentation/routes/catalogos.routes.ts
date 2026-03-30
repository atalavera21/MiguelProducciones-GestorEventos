import { Router } from 'express';
import { CatalogoController } from '../controllers/CatalogoController';

// Los catálogos son datos de referencia de solo lectura.
// El frontend los usa para poblar selectores (tipo de evento, servicios, estados).

const router = Router();
const controller = new CatalogoController();

// GET /api/catalogos/tipos-evento
// GET /api/catalogos/tipos-servicio
// GET /api/catalogos/estados-contrato

router.get('/tipos-evento', controller.getTiposEvento);
router.get('/tipos-servicio', controller.getTiposServicio);
router.get('/estados-contrato', controller.getEstadosContrato);

export default router;
