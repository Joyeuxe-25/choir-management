'use client';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from './ThemeToggle';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const pageTitle = pathname.split('/').pop() || 'Dashboard';
  const title = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuButton} onClick={onMenuClick}>☰</button>
        <div>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>Chorale Angelus Dei</p>
        </div>
      </div>
      <div className={styles.right}>
        <ThemeToggle />
        <div className={styles.user}>
          <span className={styles.avatar}>👤</span>
          <span className={styles.name}>{user?.name || 'User'}</span>
        </div>
        <button className={styles.logoutBtn} onClick={logout}>Logout</button>
      </div>
    </header>
  );
}