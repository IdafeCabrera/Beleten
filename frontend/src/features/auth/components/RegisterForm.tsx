// frontend/src/features/auth/components/RegisterForm.tsx
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import styles from '../styles/RegisterForm.module.css';

const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    history.push('/login'); // Esto asumirá que estás en localhost y te llevará a localhost/register
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();



    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setError(null);
      await register(username, email, password, 2);
      history.push('/login'); // Redirige al login después del registro
    } catch (err) {
      setError('Error al registrar. Intenta nuevamente.');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.svgContainer}>
        <div>
          <svg
            className={styles.mySVG}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 200 200"
          >
            {/* Inserta aquí el SVG */}
          </svg>
        </div>
      </div>

      <div className={`${styles.inputGroup} ${styles.inputGroup1}`}>
        <label htmlFor="username">Nombre de Usuario</label>
        <input
          type="text"
          id="username"
          className={styles.username}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="nameUser"
        />
      </div>

      <div className={`${styles.inputGroup} ${styles.inputGroup2}`}>
        <label htmlFor="email">Correo Electrónico</label>
        <input
          type="text"
          id="email"
          className={styles.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@domain.com"
        />
      </div>

      <div className={`${styles.inputGroup} ${styles.inputGroup3}`}>
        <label htmlFor="password">Contraseña</label>
        <div className={styles.passwordWrapper}>
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          className={styles.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingrese su contraseña"
        />
         <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
      </div>
      </div>

      <div className={`${styles.inputGroup} ${styles.inputGroup4}`}>
        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
        <div className={styles.passwordWrapper}>
        <input
          type={showPassword1 ? 'text' : 'password'}
          id="confirmPassword"
          className={styles.password}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirma tu contraseña"
        />
                  <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword1(!showPassword1)}
          >
            {showPassword1 ? 'Ocultar' : 'Mostrar'}
          </button>
      </div>
      </div>

      <div className={`${styles.inputGroup} ${styles.inputGroup5}`}>
        <button type="submit" id="register" className={styles.button_register}>
          Registrarse
        </button>
      </div>

      <div className={`${styles.inputGroup} ${styles.inputGroup5}`}>
        <button 
          type="button" 
          id="login" 
          onClick={handleLogin} 
          className={styles.button_login}>
          Login
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};

export default RegisterForm;
