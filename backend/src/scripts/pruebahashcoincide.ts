// backend/src/scripts/pruebahashcoincide.ts
import bcrypt from 'bcrypt';

const hashedPassword = '$2b$10$jrNIjDJivkoufeaH1yijVe7LpYpRnnyZBYWiElaJgz2TGEUmi0bNW';
const plainPassword = 'examplepassword';

bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
  if (err) {
    console.error('Error comparando contraseñas:', err);
  } else {
    console.log('¿La contraseña coincide?:', result);
  }
});