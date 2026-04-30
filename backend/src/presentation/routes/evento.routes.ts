import { Router } from 'express';
import { EventoController } from '../controllers/EventoController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { rolesMiddleware } from '../middlewares/roles.middleware';

const router = Router();
const controller = new EventoController();

const soloEditores = [authMiddleware, rolesMiddleware(['ADMIN', 'DUENO'])];

router.get('/',       controller.listar);
router.get('/:id',    controller.obtener);
router.post('/',      soloEditores, controller.crear);
router.patch('/:id',  soloEditores, controller.actualizar);
router.delete('/:id', soloEditores, controller.eliminar);

export default router;
