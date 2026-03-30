'use client';
import { usePathname } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import styles from './Header.module.css';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { role, setRole } = useRole();
  const pageTitle = pathname.split('/').pop() || 'Dashboard';
  const title = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as 'admin' | 'secretary' | 'voiceLeader');
  };

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
        <div className={styles.roleSwitcher}>
          <label htmlFor="role-select">Role: </label>
          <select id="role-select" value={role} onChange={handleRoleChange}>
            <option value="admin">Admin</option>
            <option value="secretary">Secretary</option>
            <option value="voiceLeader">Voice Leader</option>
          </select>
        </div>
        <div className={styles.user}>
          <span className={styles.avatar}>👤</span>
          <span className={styles.name}>John Doe</span>
        </div>
      </div>
    </header>
  );
}