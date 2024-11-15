// backend/src/models/index.ts
import sequelize from '../config/config';
import User from './User';
import Role from './Role';
import Phrase from './Phrase';
import PhraseTags from './PhraseTags';
import Tag from './Tag';
import UserPhraseInteraction from './UserPhraseInteraction';
import UserPhrasePermission from './UserPhrasePermission';

const isDevelopment = process.env.NODE_ENV === 'development';

// Inicializar modelos inmediatamente
console.log("🚀 Iniciando inicialización de modelos...");

const models = [
  Role,
  User,
  Phrase,
  PhraseTags,
  Tag,
  UserPhraseInteraction,
  UserPhrasePermission
];

// Inicializar todos los modelos
for (const model of models) {
  model.initialize(sequelize);
  console.log(`✅ Modelo ${model.name} inicializado correctamente.`);
}

// Establecer asociaciones
User.associate({ Role, UserPhrasePermission, UserPhraseInteraction });
Role.associate({ User });
Phrase.associate({ Tag, UserPhraseInteraction, UserPhrasePermission });
Tag.associate({ Phrase });
UserPhraseInteraction.associate({ User, Phrase });
UserPhrasePermission.associate({ User, Phrase });

console.log("✨ Inicialización de modelos y asociaciones completada");

// Función para sincronizar la base de datos
export const syncDatabase = async () => {
  if (isDevelopment) {
    console.log('🔄 Sincronizando base de datos en modo desarrollo...');
    await sequelize.sync({ alter: true });
    console.log('✅ Base de datos sincronizada con alter:true');
  } else {
    console.log('🔍 Verificando conexión a base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión a base de datos verificada');
  }
};

// Exportar modelos y funciones
export {
  sequelize,
  User,
  UserPhraseInteraction,
  UserPhrasePermission,
  Role,
  Phrase,
  Tag
};