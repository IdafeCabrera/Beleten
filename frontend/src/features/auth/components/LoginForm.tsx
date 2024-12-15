// frontend/src/features/auth/components/LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import styles from '../styles/LoginForm.module.css';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState(''); // Identifier can be email or username
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await login(identifier, password);
    } catch (err) {
      setError('Credenciales inválidas. Intenta nuevamente.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Correo electrónico o nombre de usuario"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button}>Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default LoginForm;
