'use client';
import { useRouter } from 'next/navigation';
import SectionCard from '@/components/shared/SectionCard';
import Button from '@/components/shared/Button';
import { useDashboard } from '@/hooks/useDashboard';
import styles from './RecentSongsPreview.module.css';

interface RecentSongsPreviewProps {
  limit?: number;
}

export default function RecentSongsPreview({ limit = 3 }: RecentSongsPreviewProps) {
  const { data, loading, error } = useDashboard();
  const router = useRouter();

  const songs = (data?.recent_songs ?? []).slice(0, limit);

  return (
    <SectionCard
      title="Recent Songs"
      actions={
        <Button variant="outline" onClick={() => router.push('/songs')}>
          View all
        </Button>
      }
    >
      {loading && <p className={styles.state}>Loading...</p>}
      {error && <p className={styles.state}>Could not load songs.</p>}
      {!loading && !error && songs.length === 0 && (
        <p className={styles.state}>No songs added yet.</p>
      )}
      {!loading && !error && songs.length > 0 && (
        <div className={styles.list}>
          {songs.map(song => (
            <div key={song.id} className={styles.item}>
              <div className={styles.title}>{song.title}</div>
              <div className={styles.meta}>{song.category} · {song.language}</div>
              <div className={styles.date}>Added: {song.upload_date}</div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}