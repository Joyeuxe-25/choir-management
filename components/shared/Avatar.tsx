import React from 'react';
import styles from './Avatar.module.css';

interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Avatar({ name, src, size = 'md' }: AvatarProps) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';
  return (
    <div className={`${styles.avatar} ${styles[size]}`}>
      {src ? <img src={src} alt={name} className={styles.image} /> : <span>{initials}</span>}
    </div>
  );
}