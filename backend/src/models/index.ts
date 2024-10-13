import { Sequelize } from 'sequelize';
import Todo from './Todo';  // Asegúrate de que esté bien definido
import Frase from './Frase';  // Añade tu modelo Frase si es necesario
import sequelize from '../config/config'; // Donde configuras la conexión a la base de datos

// Inicializar modelos
Todo.initialize(sequelize);
Frase.initialize(sequelize);

// Exportar sequelize y modelos
export { sequelize, Todo, Frase };
