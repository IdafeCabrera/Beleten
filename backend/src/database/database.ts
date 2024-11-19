// src/database/database.ts
import { Sequelize } from 'sequelize';
import { config } from '../config';

export const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' 
      ? (msg) => console.log(`🔍 SQL: ${msg}`) 
      : false,
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      underscored: true,
      freezeTableName: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export const initDatabase = async () => {
  try {
    console.log('🔄 Iniciando conexión a la base de datos...');
    
    // Verificar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión establecida correctamente.');

    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Sincronizando base de datos en modo desarrollo...');
      
      // Primero, verificar si las tablas existen
      const [results] = await sequelize.query(`
        SELECT TABLE_NAME 
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = '${config.db.name}'
      `);
      
      const existingTables = (results as any[]).map(r => r.TABLE_NAME);
      console.log('📋 Tablas existentes:', existingTables);

      if (existingTables.length === 0) {
        // Si no hay tablas, crear todo desde cero
        console.log('🆕 No se encontraron tablas, creando estructura inicial...');
        await sequelize.sync({ force: true });
        
        // Aquí podrías insertar datos iniciales si lo necesitas
        console.log('✅ Estructura inicial creada.');
      } else {
        // Si hay tablas, actualizar con precaución
        console.log('🔄 Actualizando estructura de tablas existentes...');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        try {
          await sequelize.sync({ alter: true });
          console.log('✅ Estructura actualizada correctamente.');
        } finally {
          await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        }
      }
      
      // Verificar las tablas después de la sincronización
      const [finalTables] = await sequelize.query(`
        SELECT TABLE_NAME 
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = '${config.db.name}'
      `);
      console.log('📋 Tablas finales:', (finalTables as any[]).map(r => r.TABLE_NAME));
    } else {
      // En producción, solo verificar la estructura
      await sequelize.sync({ force: false });
      console.log('✅ Estructura de base de datos verificada en modo producción.');
    }
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    throw error;
  }
};

// Función para insertar datos de prueba si es necesario
export const insertInitialData = async () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      // Aquí puedes insertar datos iniciales de prueba
      // Por ejemplo:
      const [phraseCount] = await sequelize.query('SELECT COUNT(*) as count FROM phrases');
      if ((phraseCount as any[])[0].count === 0) {
        console.log('📝 Insertando datos de prueba...');
        // Insertar tus datos de prueba aquí
      }
    } catch (error) {
      console.error('❌ Error al insertar datos iniciales:', error);
    }
  }
};

export const closeDatabase = async () => {
  try {
    await sequelize.close();
    console.log('✅ Conexión a la base de datos cerrada correctamente.');
  } catch (error) {
    console.error('❌ Error al cerrar la conexión:', error);
    throw error;
  }
};