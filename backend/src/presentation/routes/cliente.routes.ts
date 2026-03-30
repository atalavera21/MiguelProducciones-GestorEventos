import { Router } from 'express';
import { ClienteController } from '../controllers/ClienteController';

// El Router de Express es equivalente a un [ApiController] + [Route("api/clientes")]
// en .NET — agrupa las rutas relacionadas bajo un mismo prefijo.

const router = Router();
const controller = new ClienteController();

// GET    /api/clientes        → listar todos
// POST   /api/clientes        → crear uno nuevo
// GET    /api/clientes/:id    → obtener uno por id
// PATCH  /api/clientes/:id    → actualizar parcialmente
// DELETE /api/clientes/:id    → eliminar

router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/:id', controller.getById);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
