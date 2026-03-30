import { Router } from 'express';
import { ProformaController } from '../controllers/ProformaController';

const router = Router();
const controller = new ProformaController();

// POST   /api/proformas      → crear proforma
// GET    /api/proformas/:id  → obtener proforma por id
// DELETE /api/proformas/:id  → eliminar proforma

router.post('/', controller.create);
router.get('/:id', controller.getById);
router.delete('/:id', controller.remove);

export default router;
