'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoRole, setDemoRole] = useState<'admin' | 'secretary' | 'voiceLeader'>('admin');

  // Simple client-side validation
  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password.trim()) {
      setError('Password is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demo authentication logic – remove when real auth is added
    // For demo, any email with '@' and non-empty password succeeds.
    // The role is taken from the demo selector.
    if (email.includes('@') && password.length > 0) {
      // In a real app, the role would come from the backend.
      // Here we redirect based on the selected demo role.
      router.push('/dashboard');
    } else {
      setError('Invalid email or password (demo: use any email with @ and any password)');
    }
    setIsLoading(false);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.brand}>
        <span className={styles.logo}>🎵</span>
        <h1 className={styles.title}>Choir Manager</h1>
        <p className={styles.subtitle}>Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <div className={styles.passwordField}>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.options}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          <a href="#" className={styles.forgotLink}>Forgot password?</a>
        </div>

        <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>

        {/* Demo role selector – temporary, remove when real auth is implemented */}
        <div className={styles.demoNote}>
          <p className={styles.demoLabel}>Demo mode – select role:</p>
          <select
            value={demoRole}
            onChange={(e) => setDemoRole(e.target.value as any)}
            className={styles.demoSelect}
          >
            <option value="admin">Admin</option>
            <option value="secretary">Secretary</option>
            <option value="voiceLeader">Voice Leader</option>
          </select>
          <p className={styles.demoHint}>
            (Any email with @ and any password will work)
          </p>
        </div>
      </form>
    </div>
  );
}