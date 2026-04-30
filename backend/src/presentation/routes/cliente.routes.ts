import { Router } from 'express';
import { ClienteController } from '../controllers/ClienteController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { rolesMiddleware } from '../middlewares/roles.middleware';

const router = Router();
const controller = new ClienteController();

// Mutaciones requieren JWT + rol ADMIN/DUENO. Lectura es pública.
const soloEditores = [authMiddleware, rolesMiddleware(['ADMIN', 'DUENO'])];

router.get('/',         controller.listar);
router.get('/:id',      controller.obtener);
router.post('/',        soloEditores, controller.crear);
router.patch('/:id',    soloEditores, controller.actualizar);
router.delete('/:id',   soloEditores, controller.eliminar);

export default router;
