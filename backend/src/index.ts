import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import apiRoutes from './presentation/routes';

const app = express();

// --- Middlewares globales ---
app.use(cors());
app.use(express.json());

// --- Rutas ---

// Ruta de salud — para verificar que el servidor está vivo
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    project: 'Gestor Eventos — Miguel Producciones',
    timestamp: new Date().toISOString(),
  });
});

// Todas las rutas de la API viven bajo /api
// Equivale a MapControllers() con una convención de prefijo en .NET
app.use('/api', apiRoutes);

// --- Arranque ---
const PORT = process.env.PORT ?? 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
