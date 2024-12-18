// backend/src/scripts/populate-phrases-script.ts
import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import Phrase from '../models/Phrase';
import Tag from '../models/Tag';

// Configuración de logs
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const logStream = fs.createWriteStream(
  path.join(logDir, `import_${new Date().toISOString().replace(/[:.]/g, '-')}.log`),
  { flags: 'a' }
);

// Función para logging
function log(message: string, consoleOnly: boolean = false) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  if (!consoleOnly) {
    logStream.write(logMessage + '\n');
  }
}

// Interfaz para las opciones de importación
interface ImportOptions {
  mode: 'skip' | 'update' | 'clean';
  dryRun: boolean;
}

// Configurar Sequelize
const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'beleten_db',
  username: process.env.DB_USER || 'beleten_user',
  password: process.env.DB_PASSWORD || '12345',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  dialect: 'mysql',
  logging: (msg) => log(msg, true)
});

async function initializeModels() {
  try {
    // Inicializar modelos
    await Phrase.initialize(sequelize);
    await Tag.initialize(sequelize);

    // Establecer asociaciones
    Phrase.associate({ Tag });
    Tag.associate({ Phrase });

    await sequelize.sync({ alter: true });
    log('✅ Modelos inicializados y sincronizados correctamente');
  } catch (error) {
    log(`❌ Error inicializando modelos: ${error}`);
    throw error;
  }
}

async function cleanDatabase() {
  log('🧹 Limpiando base de datos...');
  await sequelize.transaction(async (t) => {
    await sequelize.models.phrase_tags.destroy({ where: {}, transaction: t });
    await Phrase.destroy({ where: {}, transaction: t });
    await Tag.destroy({ where: {}, transaction: t });
  });
  log('✅ Base de datos limpiada');
}

async function processFile(filePath: string, options: ImportOptions, stats: ProcessingStats) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jsonDataArray = JSON.parse(fileContent);
    log(`📄 Procesando archivo ${path.basename(filePath)} con ${jsonDataArray.length} frases`);
    stats.totalPhrases += jsonDataArray.length;

    await sequelize.transaction(async (t) => {
      for (const data of jsonDataArray) {
        try {
          const existingPhrase = await Phrase.findOne({ 
            where: { text: data.text },
            transaction: t 
          });

          if (existingPhrase && options.mode === 'skip') {
            log(`⏭️ Saltando frase existente: "${data.text.substring(0, 30)}..."`);
            stats.skipped++;
            continue;
          }

          if (options.dryRun) {
            log(`🔍 [DRY RUN] Procesaría frase: "${data.text.substring(0, 30)}..."`);
            stats.processed++;
            continue;
          }

          let phrase;
          if (existingPhrase && options.mode === 'update') {
            await existingPhrase.update({
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
            }, { transaction: t });
            phrase = existingPhrase;
            stats.updated++;
          } else {
            phrase = await Phrase.create({
              text: data.text,
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
            }, { transaction: t });
            stats.created++;
          }

          // Procesar tags
          if (data.tags) {
            for (const [language, tags] of Object.entries(data.tags)) {
              for (const tagName of tags as string[]) {
                const [tag] = await Tag.findOrCreate({
                  where: { name: tagName.toLowerCase().trim() },
                  transaction: t
                });
                
                await sequelize.models.phrase_tags.findOrCreate({
                  where: {
                    phraseId: phrase.id,
                    tagId: tag.id
                  },
                  transaction: t
                });
              }
            }
          }

          stats.processed++;
          log(`✅ Frase procesada (${stats.processed}/${stats.totalPhrases}): "${data.text.substring(0, 30)}..."`);
        } catch (error) {
          stats.errors++;
          log(`❌ Error procesando frase: ${error}`);
          throw error; // Para hacer rollback de la transacción
        }
      }
    });
  } catch (error) {
    log(`❌ Error procesando archivo ${path.basename(filePath)}: ${error}`);
    throw error;
  }
}

interface ProcessingStats {
  totalFiles: number;
  totalPhrases: number;
  processed: number;
  created: number;
  updated: number;
  skipped: number;
  errors: number;
}

async function main() {
  const options: ImportOptions = {
    mode: process.argv.includes('--update') ? 'update' : 
          process.argv.includes('--clean') ? 'clean' : 'skip',
    dryRun: process.argv.includes('--dry-run')
  };

  const stats: ProcessingStats = {
    totalFiles: 0,
    totalPhrases: 0,
    processed: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: 0
  };

  log('🚀 Iniciando script...');
  log(`Modo: ${options.mode}${options.dryRun ? ' (dry run)' : ''}`);

  try {
    await sequelize.authenticate();
    log('✅ Conexión a base de datos establecida');

    await initializeModels();

    if (options.mode === 'clean') {
      await cleanDatabase();
    }

    const directoryPath = path.join(__dirname, 'frases');
    if (!fs.existsSync(directoryPath)) {
      throw new Error(`❌ No se encontró el directorio de frases en: ${directoryPath}`);
    }

    const files = fs.readdirSync(directoryPath)
      .filter(file => file.endsWith('.json'));
    
    stats.totalFiles = files.length;
    log(`📑 Encontrados ${files.length} archivos JSON`);

    for (const [index, file] of files.entries()) {
      log(`\n📝 Procesando archivo ${index + 1}/${files.length}: ${file}`);
      await processFile(path.join(directoryPath, file), options, stats);
    }

    log('\n📊 Resumen del proceso:');
    log(`Total archivos: ${stats.totalFiles}`);
    log(`Total frases: ${stats.totalPhrases}`);
    log(`Frases procesadas: ${stats.processed}`);
    log(`Frases creadas: ${stats.created}`);
    log(`Frases actualizadas: ${stats.updated}`);
    log(`Frases saltadas: ${stats.skipped}`);
    log(`Errores: ${stats.errors}`);

    log('\n✅ Proceso completado');
  } catch (error) {
    log(`❌ Error: ${error}`);
    process.exit(1);
  } finally {
    await sequelize.close();
    logStream.end();
  }
}

log('📌 Script cargado');
main();
