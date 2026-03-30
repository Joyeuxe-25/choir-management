import SectionCard from '@/components/shared/SectionCard';
import Button from '@/components/shared/Button';
import { recentSongs } from '@/data/dashboard';
import styles from './RecentSongsPreview.module.css';

interface RecentSongsPreviewProps {
  limit?: number;
}

export default function RecentSongsPreview({ limit = 3 }: RecentSongsPreviewProps) {
  const songsToShow = recentSongs.slice(0, limit);

  return (
    <SectionCard
      title="Recent Songs"
      actions={<Button variant="outline">View all</Button>}
    >
      {songsToShow.length === 0 ? (
        <p>No songs added yet.</p>
      ) : (
        <div className={styles.list}>
          {songsToShow.map((song) => (
            <div key={song.id} className={styles.item}>
              <div>
                <div className={styles.title}>{song.title}</div>
                <div className={styles.composer}>{song.composer}</div>
                <div className={styles.date}>Added: {song.addedDate}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}