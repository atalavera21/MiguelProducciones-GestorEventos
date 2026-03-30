import { Router } from 'express';
import { EventoController } from '../controllers/EventoController';

const router = Router();
const controller = new EventoController();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/:id', controller.getById);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
