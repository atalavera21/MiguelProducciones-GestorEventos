import { Router } from 'express';
import clienteRoutes   from './cliente.routes';
import eventoRoutes    from './evento.routes';
import contratoRoutes  from './contrato.routes';
import proformaRoutes  from './proforma.routes';
import catalogoRoutes  from './catalogos.routes';

// Este router raíz agrupa todas las rutas de la API bajo /api.
// Para agregar un módulo nuevo: crear su routes file y añadir una línea aquí.
const router = Router();

router.use('/clientes',  clienteRoutes);
router.use('/eventos',   eventoRoutes);
router.use('/contratos', contratoRoutes);
router.use('/proformas', proformaRoutes);
router.use('/catalogos', catalogoRoutes);

export default router;
