'use client';
import { usePathname } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import styles from './Header.module.css';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { role } = useRole();
  const pageTitle = pathname.split('/').pop() || 'Dashboard';
  const title = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);


  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuButton} onClick={onMenuClick}>☰</button>
        <div>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>Choir Management System</p>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.user}>
          <span className={styles.avatar}>👤</span>
          <span className={styles.name}>John Doe</span>
        </div>
      </div>
    </header>
  );
}