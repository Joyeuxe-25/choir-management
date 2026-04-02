'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import { useAuth } from '@/context/AuthContext';
import { getNavigationForRole } from '@/lib/navigation';
import styles from './Sidebar.module.css';

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { role } = useRole();
  const { user, logout } = useAuth();
  const navItems = getNavigationForRole(role);

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.logo}>
        <Image
          src="/logo.jpeg"
          alt="Chorale Angelus Dei"
          width={36}
          height={36}
          className={styles.logoImage}
        />
        <span className={styles.logoText}>Chorale Angelus Dei</span>
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
          <span className={styles.userName}>{user?.name || 'User'}</span>
        </div>
        <button className={styles.logoutButton} onClick={logout}>Logout</button>
      </div>
    </aside>
  );
}