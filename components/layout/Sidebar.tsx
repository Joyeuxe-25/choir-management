'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import { getNavigationForRole } from '@/lib/navigation';
import styles from './Sidebar.module.css';

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { role } = useRole();
  const navItems = getNavigationForRole(role);

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🎵</span>
        <span className={styles.logoText}>Choir Manager</span>
      </div>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
            onClick={onClose}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <span className={styles.userAvatar}>👤</span>
          <span className={styles.userName}>John Doe</span>
        </div>
        <button className={styles.logoutButton}>Logout</button>
      </div>
    </aside>
  );
}