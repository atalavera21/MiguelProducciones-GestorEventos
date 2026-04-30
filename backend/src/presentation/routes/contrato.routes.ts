import { Router } from 'express';
import { ContratoController } from '../controllers/ContratoController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { rolesMiddleware } from '../middlewares/roles.middleware';

const router = Router();
const controller = new ContratoController();

const soloEditores = [authMiddleware, rolesMiddleware(['ADMIN', 'DUENO'])];

// Lectura pública
router.get('/',    controller.listar);
router.get('/:id', controller.obtener);

// Mutaciones protegidas
router.post('/desde-evento/:idEvento', soloEditores, controller.generarDesdeEvento);
router.patch('/:id/estado',            soloEditores, controller.cambiarEstado);
router.delete('/:id',                  soloEditores, controller.eliminar); // → transición a Cancelado

export default router;
