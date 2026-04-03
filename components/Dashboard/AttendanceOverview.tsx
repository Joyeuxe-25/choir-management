'use client';

import SectionCard from '@/components/shared/SectionCard';
import { useDashboard } from '@/hooks/useDashboard';
import styles from './AttendanceOverview.module.css';

export default function AttendanceOverview() {
  const { data, loading, error } = useDashboard();

  const att = data?.today_attendance;
  const present = att?.present  ?? 0;
  const absent  = att?.absent   ?? 0;
  const late    = att?.late     ?? 0;
  const excused = att?.excused  ?? 0;

  const total = present + absent + late + excused;
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

  const rows = [
    { label: 'Present', value: present, color: '#28a745', percent: pct(present) },
    { label: 'Absent',  value: absent,  color: '#dc3545', percent: pct(absent)  },
    { label: 'Late',    value: late,    color: '#ffc107', percent: pct(late)    },
    { label: 'Excused', value: excused, color: '#6c757d', percent: pct(excused) },
  ];

  return (
    <SectionCard title="Today's Attendance">
      {error && (
        <p style={{ color: '#dc3545', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
          Could not load attendance data.
        </p>
      )}
      <div className={styles.stats}>
        {rows.map(({ label, value, color, percent }) => (
          <div key={label} className={styles.stat}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>
              {loading ? '…' : error ? '—' : value}
            </span>
            <div
              className={styles.bar}
              style={{
                width: loading ? '20%' : `${percent}%`,
                backgroundColor: color,
                opacity: loading ? 0.25 : 1,
                transition: 'width 0.3s',
              }}
            />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}