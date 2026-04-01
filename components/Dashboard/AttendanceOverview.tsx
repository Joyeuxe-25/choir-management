import SectionCard from '@/components/shared/SectionCard';
import { attendanceRecords } from '@/data/attendance';
import styles from './AttendanceOverview.module.css';

export default function AttendanceOverview() {
  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Filter to today's records
  const todayRecords = attendanceRecords.filter(r => r.date === today);

  // If no records today, fall back to most recent date
  const latestDate = todayRecords.length > 0
    ? today
    : attendanceRecords.reduce((latest, r) => r.date > latest ? r.date : latest, '');

  const relevantRecords = attendanceRecords.filter(r => r.date === latestDate);

  const present = relevantRecords.filter(r => r.status === 'present').length;
  const absent = relevantRecords.filter(r => r.status === 'absent').length;
  const late = relevantRecords.filter(r => r.status === 'late').length;

  const total = present + absent + late;
  const presentPercent = total ? Math.round((present / total) * 100) : 0;
  const absentPercent = total ? Math.round((absent / total) * 100) : 0;
  const latePercent = total ? Math.round((late / total) * 100) : 0;

  return (
    <SectionCard title="Today's Attendance">
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.label}>Present</span>
          <span className={styles.value}>{present}</span>
          <div className={styles.bar} style={{ width: `${presentPercent}%`, backgroundColor: '#28a745' }} />
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Absent</span>
          <span className={styles.value}>{absent}</span>
          <div className={styles.bar} style={{ width: `${absentPercent}%`, backgroundColor: '#dc3545' }} />
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Late</span>
          <span className={styles.value}>{late}</span>
          <div className={styles.bar} style={{ width: `${latePercent}%`, backgroundColor: '#ffc107' }} />
        </div>
      </div>
    </SectionCard>
  );
}