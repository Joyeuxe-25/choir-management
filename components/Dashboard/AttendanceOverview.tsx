import SectionCard from '@/components/shared/SectionCard';
import { attendanceSummary } from '@/data/dashboard';
import styles from './AttendanceOverview.module.css';

export default function AttendanceOverview() {
  const total = attendanceSummary.present + attendanceSummary.absent + attendanceSummary.late;
  const presentPercent = Math.round((attendanceSummary.present / total) * 100);
  const absentPercent = Math.round((attendanceSummary.absent / total) * 100);
  const latePercent = Math.round((attendanceSummary.late / total) * 100);

  return (
    <SectionCard title="Today's Attendance">
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.label}>Present</span>
          <span className={styles.value}>{attendanceSummary.present}</span>
          <div className={styles.bar} style={{ width: `${presentPercent}%`, backgroundColor: '#28a745' }} />
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Absent</span>
          <span className={styles.value}>{attendanceSummary.absent}</span>
          <div className={styles.bar} style={{ width: `${absentPercent}%`, backgroundColor: '#dc3545' }} />
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Late</span>
          <span className={styles.value}>{attendanceSummary.late}</span>
          <div className={styles.bar} style={{ width: `${latePercent}%`, backgroundColor: '#ffc107' }} />
        </div>
      </div>
    </SectionCard>
  );
}