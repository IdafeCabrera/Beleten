// backend/src/scripts/populatephrases.ts
import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import Phrase from '../models/Phrase';
import Tag from '../models/Tag';

// Configurar Sequelize
const sequelize = new Sequelize('beleten_db', 'beleten_user', '12345', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  logging: (msg) => console.log(msg)
});

// Inicializar los modelos
Phrase.initialize(sequelize);
Tag.initialize(sequelize);

// Establecer las asociaciones
Phrase.associate({ Tag });
Tag.associate({ Phrase });

async function processFile(filePath: string) {
  try {
    const jsonDataArray = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`📄 Procesando archivo con ${jsonDataArray.length} frases`);

    for (const data of jsonDataArray) {
      try {
        // Crear o encontrar la frase
        const [phrase, created] = await Phrase.findOrCreate({
          where: { text: data.text },
          defaults: {
            author: data.author,
            category: data.category,
            date_of_birth: data.date_of_birth,
            date_of_death: data.date_of_death,
            reflection: data.reflection,
            historical_context: data.historical_context,
            career: data.career,
            author_image: data.author_image,
            default_background_image: data.default_background_image,
            custom_background_image: data.custom_background_image,
            submitted_by: data.submitted_by,
            original_language: data.original_language,
            is_verified: data.is_verified,
            is_editable: data.is_editable
          }
        });

        // Procesar tags si existen
        if (data.tags) {
          for (const [language, tags] of Object.entries(data.tags)) {
            for (const tagName of tags as string[]) {
              const [tag] = await Tag.findOrCreate({
                where: { name: tagName.toLowerCase().trim() }
              });
              
              // Usar la tabla intermedia directamente
              await sequelize.models.phrase_tags.create({
                phraseId: phrase.id,
                tagId: tag.id
              });
            }
          }
        }

        console.log(`✅ Frase procesada: "${data.text.substring(0, 30)}..."`);
      } catch (error) {
        console.error(`❌ Error procesando frase:`, error);
      }
    }
  } catch (error) {
    console.error(`❌ Error procesando archivo:`, error);
  }
}

async function main() {
  console.log('🚀 Iniciando script...');

  try {
    // Verificar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión establecida correctamente');

    // Sincronizar modelos con la base de datos
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados');

    // Procesar archivos
    const directoryPath = path.join(__dirname, 'frases');
    const files = fs.readdirSync(directoryPath);
    console.log(`📑 Encontrados ${files.length} archivos`);

    for (const file of files) {
      console.log(`\n📝 Procesando ${file}...`);
      await processFile(path.join(directoryPath, file));
    }

    console.log('\n✅ Proceso completado');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

console.log('📌 Script cargado');
main();