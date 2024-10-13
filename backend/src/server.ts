// /backend/src/server.ts
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { sequelize } from './models/index';
import todoRoutes from './routes/todoRoutes';
import fraseRoutes from './routes/fraseRoutes';

const app = express();
app.use(cors());
app.use(bodyParser.json());
// RUTAS
app.use('/api/todos', todoRoutes);
app.use('/api/frases', fraseRoutes);

// Iniciar la base de datos y sincronizar tablas
sequelize.sync({ alter: true })
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
