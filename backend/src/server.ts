// backend/src/server.ts
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { sequelize, syncDatabase } from './models/index';
import phraseRoutes from './routes/phraseRoutes';
import path from 'path';

const app = express();
const isDevelopment = process.env.NODE_ENV === 'development';


// Aumentar límite de payload
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



if (isDevelopment) {
  app.use(cors({
    origin: true,
    credentials: true
  }));
} else {
  app.use(cors({
    origin: ['http://localhost:8080'], // Ajusta según tus necesidades en producción
    credentials: true
  }));
}

console.log(`Iniciando servidor en modo ${isDevelopment ? 'desarrollo' : 'producción'}`);

// Configurar CORS para permitir solicitudes desde Android
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8100', 'capacitor://localhost'],
  credentials: true
}));
app.use(bodyParser.json());

// Configurar directorio de imágenes como público
// Servir archivos estáticos
app.use('/images', express.static(path.join(__dirname, '../public/images'), {
  setHeaders: (res, path, stat) => {
    res.set('Access-Control-Allow-Origin', '*');
  }
}));


app.use('/api/phrases', phraseRoutes);

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