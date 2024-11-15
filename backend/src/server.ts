// backend/src/server.ts
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { sequelize, syncDatabase } from './models/index';
import phraseRoutes from './routes/phraseRoutes';

const app = express();
const isDevelopment = process.env.NODE_ENV === 'development';

console.log(`Iniciando servidor en modo ${isDevelopment ? 'desarrollo' : 'producción'}`);

app.use(cors());
app.use(bodyParser.json());

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