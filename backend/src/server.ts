// /backend/src/server.ts
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { sequelize } from './models/index';
import phraseRoutes from './routes/phraseRoutes';

const app = express();
app.use(cors());
app.use(bodyParser.json());
// RUTAS

app.use('/api/phrases', phraseRoutes);

// Iniciar la base de datos y sincronizar tablas 
sequelize.sync({ alter: true }) // Al usar { force: true } eliminas y recreas las tablas
  .then(() => {
    console.log('Base de datos sincronizada correctamente.');
    // Iniciar el servidor
    app.listen(8080, () => {
      console.log('Servidor corriendo en el puerto 8080');
    });
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
  });
