// backend/src/config/auth.config.ts
export default {
    jwtSecret: process.env.JWT_SECRET || 'tu_secreto_muy_seguro',
    jwtExpiresIn: '24h',
    refreshTokenExpiresIn: '7d',
    bcryptSaltRounds: 10,
    basicAuthEnabled: true,
    tokenAuthEnabled: true,
  };