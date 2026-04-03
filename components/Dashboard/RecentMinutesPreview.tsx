'use client';
import { useRouter } from 'next/navigation';
import SectionCard from '@/components/shared/SectionCard';
import Button from '@/components/shared/Button';
import { useDashboard } from '@/hooks/useDashboard';
import styles from './RecentMinutesPreview.module.css';

export default function RecentMinutesPreview() {
  const { data, loading, error } = useDashboard();
  const router = useRouter();

  const minutes = data?.recent_minutes ?? [];

  return (
    <SectionCard
      title="Recent Minutes"
      actions={
        <Button variant="outline" onClick={() => router.push('/minutes')}>
          View all
        </Button>
      }
    >
      {loading && <p className={styles.state}>Loading...</p>}
      {error && <p className={styles.state}>Could not load minutes.</p>}
      {!loading && !error && minutes.length === 0 && (
        <p className={styles.state}>No minutes yet.</p>
      )}
      {!loading && !error && minutes.length > 0 && (
        <div className={styles.list}>
          {minutes.slice(0, 3).map(minute => (
            <div key={minute.id} className={styles.item}>
              <div className={styles.title}>{minute.title}</div>
              <div className={styles.date}>{minute.meeting_date}</div>
              <div className={styles.meta}>Recorded by {minute.recorded_by_name}</div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}