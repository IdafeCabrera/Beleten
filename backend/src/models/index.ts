// backend/src/models/index.ts
import sequelize from '../config/config'; // Conexión a la base de datos
import User from './User';
import Role from './Role';
import Phrase from './Phrase';
import PhraseTags from './PhraseTags';
import Tag from './Tag';
import UserPhraseInteraction from './UserPhraseInteraction';
import UserPhrasePermission from './UserPhrasePermission';

// Inicializar modelos (el orden importa)
console.log("Iniciando inicialización de los modelos");

Role.initialize(sequelize); 
console.log("Role inicializado");

User.initialize(sequelize); 
console.log("User inicializado");

Phrase.initialize(sequelize); 
console.log("Phrase inicializado");

PhraseTags.initialize(sequelize); 
console.log("PhraseTags inicializado");

Tag.initialize(sequelize); 
console.log("Tag inicializado");

UserPhraseInteraction.initialize(sequelize);
console.log("UserPhraseInteraction inicializado");

UserPhrasePermission.initialize(sequelize);
console.log("UserPhrasePermission inicializado");

console.log("Modelos inicializados correctamente");

// Establecer asociaciones después de inicializar los modelos
User.associate({ Role, UserPhrasePermission, UserPhraseInteraction });
Role.associate({ User });
Phrase.associate({ Tag, UserPhraseInteraction, UserPhrasePermission });  // Asocia Phrase con Tag
Tag.associate({ Phrase });  // Asocia Tag con Phrase
UserPhraseInteraction.associate({ User, Phrase });
UserPhrasePermission.associate({ User, Phrase });

// Exportar sequelize y modelos
export { sequelize, User, UserPhraseInteraction, UserPhrasePermission, Role, Phrase, Tag };
