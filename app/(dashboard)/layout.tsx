'use client';
import { useState } from 'react';
import { RoleProvider } from '@/context/RoleContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import styles from './layout.module.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <RoleProvider>
      <div className={styles.dashboard}>
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <div className={styles.main}>
          <Header onMenuClick={toggleSidebar} />
          <main className={styles.content}>{children}</main>
        </div>
        {isSidebarOpen && <div className={styles.overlay} onClick={closeSidebar} />}
      </div>
    </RoleProvider>
  );
}