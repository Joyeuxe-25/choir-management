import React from 'react';
import styles from './FilterBar.module.css';

interface FilterBarProps {
  children: React.ReactNode;
  title?: string;
}

export default function FilterBar({ children, title = 'Filters' }: FilterBarProps) {
  return (
    <div className={styles.filterBar}>
      <span className={styles.title}>{title}</span>
      <div className={styles.controls}>{children}</div>
    </div>
  );
}