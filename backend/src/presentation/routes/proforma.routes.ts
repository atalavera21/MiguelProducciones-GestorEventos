import { Router } from 'express';
import { ProformaController } from '../controllers/ProformaController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { rolesMiddleware } from '../middlewares/roles.middleware';

const router = Router();
const controller = new ProformaController();

const soloEditores = [authMiddleware, rolesMiddleware(['ADMIN', 'DUENO'])];

router.get('/:id',    controller.obtener);
router.post('/',      soloEditores, controller.crear);
router.delete('/:id', soloEditores, controller.eliminar);

export default router;
