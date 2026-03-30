import React from 'react';
import styles from './StatCard.module.css';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
}

export default function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.value}>{value}</div>
        {trend && (
          <div className={`${styles.trend} ${trend.isPositive ? styles.positive : styles.negative}`}>
            {trend.isPositive ? '▲' : '▼'} {trend.value}%
          </div>
        )}
      </div>
      {icon && <div className={styles.icon}>{icon}</div>}
    </div>
  );
}