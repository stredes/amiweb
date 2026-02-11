import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/authStore';
import { authApi } from '../../features/auth/authApi';
import { Button } from '../../components/ui/Button';
import { FadeIn } from '../../components/ui/FadeIn';
import TextInput from '../../components/ui/TextInput';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const showDemoCredentials = import.meta.env.VITE_SHOW_DEMO_CREDENTIALS !== 'false';
  const demoCredentials = [
    { role: 'Socio', email: 'socio@spdental.com', password: 'demo123' },
    { role: 'Vendedor', email: 'vendedor1@spdental.com', password: 'vende123' },
    { role: 'Bodega', email: 'bodega@spdental.com', password: 'bodega123' },
    { role: 'Admin', email: 'admin@spdental.com', password: 'admin123' },
    { role: 'Root', email: 'root@spdental.com', password: 'root2026' }
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Autenticar con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseToken = await userCredential.user.getIdToken();
      
      // 2. Obtener datos del usuario del backend/mock
      const response = await authApi.login({ email, password });
      
      // 3. Guardar en el contexto (con token de Firebase)
      login(response.user, firebaseToken);
      
      // 4. Redirigir según el rol
      if (response.user.role === 'admin' || response.user.role === 'root') {
        navigate('/admin');
      } else if (response.user.role === 'vendedor') {
        navigate('/vendedor');
      } else if (response.user.role === 'bodega') {
        navigate('/bodega');
      } else {
        navigate('/portal-socios');
      }
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
              placeholder="socio@empresa.com…"
              disabled={isLoading}
              name="email"
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
            />

            <TextInput
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={isLoading}
              name="password"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? 'Iniciando sesión…' : 'Iniciar Sesión'}
            </Button>
          </form>

          {showDemoCredentials && (
            <div className="login-footer demo-credentials">
              <p className="demo-credentials__title">Credenciales de prueba</p>
              <ul className="demo-credentials__list">
                {demoCredentials.map((credential) => (
                  <li key={credential.role}>
                    <span className="demo-credentials__role">{credential.role}</span>
                    <span className="demo-credentials__value">
                      {credential.email} / {credential.password}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.2}>
          <div className="login-info">
          <h2>Bienvenido al Portal de Socios SP Dental</h2>
          <ul>
            <li>📦 Rastrea tus pedidos en tiempo real</li>
            <li>📊 Consulta el estado de preparación</li>
            <li>👤 Contacta a tu vendedor asignado</li>
            <li>💬 Accede a soporte técnico</li>
            <li>📈 Visualiza tu historial de compras</li>
          </ul>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
