// frontend/src/features/auth/components/LoginForm.tsx
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import styles from '../styles/LoginForm.module.css';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const history = useHistory();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = () => {
    history.push('/register'); // Esto asumirá que estás en localhost y te llevará a localhost/register
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await login(identifier, password);
      history.push('/phrases'); 
    } catch (err) {
      setError('Credenciales inválidas. Intenta nuevamente.');
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
            {/* SVG content goes here */}
          </svg>
        </div>
      </div>

      <div className={`${styles.inputGroup} ${styles.inputGroup1}`}>
        <label htmlFor="email">Usuario o email</label>
        <input
          type="text"
          id="email"
          className={styles.email}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Ingrese usuario o email"
        />
       
      </div>

      <div className={`${styles.inputGroup} ${styles.inputGroup2}`}>
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




      

      <div className={`${styles.inputGroup} ${styles.inputGroup3}`}>
        <button type="submit" id="login" className={styles.button_login}>
          Iniciar Sesión
        </button>
      </div>

      <div className={`${styles.inputGroup} ${styles.inputGroup3}`}>
        <button 
          type="button" 
          onClick={handleRegister}
          id="register" 
          className={styles.button_register}
        >
          Registrarse
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};

export default LoginForm;
