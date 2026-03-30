import SectionCard from '@/components/shared/SectionCard';
import Button from '@/components/shared/Button';
import { recentMinutes } from '@/data/dashboard';
import styles from './RecentMinutesPreview.module.css';

export default function RecentMinutesPreview() {
  return (
    <SectionCard
      title="Recent Minutes"
      actions={<Button variant="outline" size="sm">View all</Button>}
    >
      {recentMinutes.length === 0 ? (
        <p>No minutes yet.</p>
      ) : (
        <div className={styles.list}>
          {recentMinutes.slice(0, 3).map(minute => (
            <div key={minute.id} className={styles.item}>
              <div>
                <div className={styles.title}>{minute.title}</div>
                <div className={styles.date}>{minute.date}</div>
                <div className={styles.summary}>{minute.summary}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}