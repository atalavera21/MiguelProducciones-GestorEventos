import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new AuthController();

// POST /api/auth/login — sin autenticación
router.post('/login', controller.login);

// GET /api/auth/me — requiere token válido
router.get('/me', authMiddleware, controller.me);

// POST /api/auth/refresh — requiere token válido
router.post('/refresh', authMiddleware, controller.refresh);

export default router;
