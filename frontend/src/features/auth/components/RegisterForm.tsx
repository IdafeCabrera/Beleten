// frontend/src/features/auth/components/RegisterForm.tsx
import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import styles from '../styles/RegisterForm.module.css';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.86.29:8080/api'; 

const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const checkUsernameAvailability = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/check-username`, {
        params: { username },
      });
      return response.data.available;
    } catch (err) {
      throw new Error('Error al verificar disponibilidad del nombre de usuario.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setError(null);
      const isAvailable = await checkUsernameAvailability();
      if (!isAvailable) {
        setError('El nombre de usuario ya está en uso.');
        return;
      }

      await register(username, password);
      setSuccess(true);
    } catch (err) {
      setError('Error al registrar. Intenta nuevamente.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Registrarse</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.input}
        />
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>Registro exitoso. ¡Inicia sesión!</p>}
        <button type="submit" className={styles.button}>Registrarse</button>
      </form>
    </div>
  );
};

export default RegisterForm;
