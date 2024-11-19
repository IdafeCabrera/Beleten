// backend/src/config/index.ts
export const config = {
    jwtSecret: process.env.JWT_SECRET || 'tu_secreto_muy_seguro',
    jwtExpiresIn: '24h',
    bcrypt: {
      saltRounds: 10
    },
    db: {
      name: process.env.DB_NAME || 'beleten_db',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'tu_password',
      host: process.env.DB_HOST || 'localhost'
    }
  };
  
  export default config;