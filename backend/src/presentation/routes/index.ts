import { Router } from 'express';
import clienteRoutes from './cliente.routes';
import eventoRoutes from './evento.routes';

// Este router raíz agrupa todas las rutas de la API bajo /api.
// Cuando agreguemos proformas, contratos, etc., solo añadimos una línea aquí.
const router = Router();

router.use('/clientes', clienteRoutes);
router.use('/eventos', eventoRoutes);

export default router;
