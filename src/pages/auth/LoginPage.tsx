import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/authStore';
import { authApi } from '../../features/auth/authApi';
import { Button } from '../../components/ui/Button';
import { FadeIn } from '../../components/ui/FadeIn';
import TextInput from '../../components/ui/TextInput';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { ENABLE_LOGIN_MOCK } from '../../config/env';
import type { User } from '../../features/auth/types';

type MockUser = User & { password: string };

const MOCK_USERS: MockUser[] = [
  {
    id: 'mock-root',
    email: 'root@amilab.com',
    password: 'Root1234!',
    name: 'Usuario Root',
    role: 'root',
    company: 'AMILAB',
    isActive: true,
  },
  {
    id: 'mock-admin',
    email: 'admin@amilab.com',
    password: 'Admin1234!',
    name: 'Usuario Admin',
    role: 'admin',
    company: 'AMILAB',
    isActive: true,
  },
  {
    id: 'mock-vendedor',
    email: 'vendedor@amilab.com',
    password: 'Vendedor1234!',
    name: 'Usuario Vendedor',
    role: 'vendedor',
    company: 'AMILAB',
    isActive: true,
  },
  {
    id: 'mock-bodega',
    email: 'bodega@amilab.com',
    password: 'Bodega1234!',
    name: 'Usuario Bodega',
    role: 'bodega',
    company: 'AMILAB',
    isActive: true,
  },
  {
    id: 'mock-socio',
    email: 'socio@amilab.com',
    password: 'Socio1234!',
    name: 'Usuario Socio',
    role: 'socio',
    company: 'Cliente Demo',
    isActive: true,
  },
];

function navigateByRole(role: User['role'], navigate: ReturnType<typeof useNavigate>) {
  if (role === 'root') {
    navigate('/root');
  } else if (role === 'admin') {
    navigate('/admin');
  } else if (role === 'vendedor') {
    navigate('/vendedor');
  } else if (role === 'bodega') {
    navigate('/bodega');
  } else {
    navigate('/portal-socios');
  }
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (ENABLE_LOGIN_MOCK) {
        const foundMock = MOCK_USERS.find(
          (mockUser) =>
            mockUser.email.toLowerCase() === email.trim().toLowerCase() &&
            mockUser.password === password
        );

        if (foundMock) {
          const { password: _password, ...user } = foundMock;
          login(user, 'mock-token-dev');
          navigateByRole(user.role, navigate);
          return;
        }
      }

      // 1. Autenticar con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseToken = await userCredential.user.getIdToken();
      
      // 2. Obtener datos del usuario desde backend
      const response = await authApi.login({ email, password });
      
      // 3. Guardar en el contexto (con token de Firebase)
      login(response.user, firebaseToken);

      // 4. Redirigir según el rol
      navigateByRole(response.user.role, navigate);
    } catch (err: any) {
      // Manejar errores de Firebase Auth
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Credenciales inválidas');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email inválido');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos. Intenta más tarde.');
      } else {
        setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <FadeIn direction="up">
          <div className="login-card">
          <div className="login-header">
            <h1>Portal de Socios</h1>
            <p className="muted">Accede a tu cuenta de Amilab</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <TextInput
              label="Email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              placeholder="socio@empresa.com"
              disabled={isLoading}
            />

            <TextInput
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <div className="login-footer">
            <p className="muted">
              Inicia sesión con tu cuenta corporativa de AMIWEB.
            </p>
          </div>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.2}>
          <div className="login-info">
          <h2>Bienvenido al Portal de Socios Amilab</h2>
          <ul>
            <li>📦 Rastrea tus pedidos en tiempo real</li>
            <li>📊 Consulta el estado de preparación</li>
            <li>👤 Contacta a tu vendedor asignado</li>
            <li>💬 Accede a soporte técnico</li>
            <li>📈 Visualiza tu historial de compras</li>
          </ul>
          {ENABLE_LOGIN_MOCK && (
            <>
              <h3 style={{ marginTop: '1rem' }}>Credenciales Mock (desarrollo)</h3>
              <ul>
                {MOCK_USERS.map((mockUser) => (
                  <li key={mockUser.id}>
                    <strong>{mockUser.role}</strong>: {mockUser.email} / {mockUser.password}
                  </li>
                ))}
              </ul>
            </>
          )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
