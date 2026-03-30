import { Router } from 'express';
import { ContratoController } from '../controllers/ContratoController';

const router = Router();
const controller = new ContratoController();

// POST   /api/contratos/desde-evento/:idEvento  → generar contrato desde un evento
// GET    /api/contratos/:id                      → obtener contrato por id
// PATCH  /api/contratos/:id/estado              → cambiar estado del contrato

router.post('/desde-evento/:idEvento', controller.generar);
router.get('/:id', controller.getById);
router.patch('/:id/estado', controller.actualizarEstadoHandler);

export default router;
