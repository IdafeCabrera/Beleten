// backend/src/types/express.d.ts
import { User } from '../models/User'; // Asegúrate de que la ruta es correcta

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}