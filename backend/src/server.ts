// backend/src/server.ts
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { sequelize, syncDatabase } from './models/index';
import phraseRoutes from './routes/phraseRoutes';
import path from 'path';
import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
  app.use(cors({
    origin: 'http://localhost:8100', // frontend desarrollo
    credentials: true // Permitir cookies/autenticación
  }));
} else {
  app.use(cors({
    origin: ['http://localhost:8100', 'http://192.168.86.29:8100'], // frontend producción
    credentials: true // Permitir cookies/autenticación
  }));
}

console.log(`Iniciando servidor en modo ${isDevelopment ? 'desarrollo' : 'producción'}`);


app.use(bodyParser.json());

app.use('/api/auth', authRoutes);

// Configurar directorio de imágenes como público
app.use('/images', express.static(path.join(__dirname, '../public/images')));


app.use('/api/phrases', phraseRoutes);

// Iniciar servidor
const startServer = async () => {
  try {
    await syncDatabase();
    
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
      console.log(`🔧 Modo: ${isDevelopment ? 'Desarrollo' : 'Producción'}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();