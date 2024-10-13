import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,        // Nombre de la base de datos
  process.env.DB_USER as string,        // Usuario de MySQL
  process.env.DB_PASSWORD as string,    // Contraseña de MySQL
  {
    host: process.env.DB_HOST,          // Host de la base de datos
    port: parseInt(process.env.DB_PORT || '3306'), // Puerto de MySQL
    dialect: 'mysql',                   // Dialecto de la base de datos (MySQL)
    logging: false                      // Puedes desactivar el logging si lo prefieres
  }
);

export default sequelize;
