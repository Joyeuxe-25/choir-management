'use client';
import { Song } from '@/types';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import EmptyState from '@/components/shared/EmptyState';
import { useRole } from '@/context/RoleContext';
import styles from './SongList.module.css';

interface SongListProps {
  songs: Song[];
  onEdit: (song: Song) => void;
  onView: (song: Song) => void;
  onDelete: (song: Song) => void;
}

export default function SongList({ songs, onEdit, onView, onDelete }: SongListProps) {
  const { role } = useRole();
  const canDelete = role === 'admin' || role === 'secretary';

  if (songs.length === 0) {
    return <EmptyState title="No songs found" description="Try adjusting filters or add a new song." />;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th className={styles.hideSmall}>Category</th>
            <th>Voice</th>
            <th className={styles.hideSmall}>Language</th>
            <th className={styles.hideMedium}>Upload Date</th>
            <th className={styles.hideSmall}>File</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <tr key={song.id}>
              <td>{song.title}</td>
              <td className={styles.hideSmall}>{song.category}</td>
              <td>{song.voice}</td>
              <td className={styles.hideSmall}>{song.language}</td>
              <td className={styles.hideMedium}>{song.upload_date}</td>
              <td className={styles.hideSmall}>
                {song.file_present
                  ? <Badge variant="success">📄 Attached</Badge>
                  : <Badge variant="default">No file</Badge>
                }
              </td>
              <td className={styles.actions}>
                <Button variant="outline" onClick={() => onView(song)}>View</Button>
                <Button variant="outline" onClick={() => onEdit(song)}>Edit</Button>
                {canDelete && (
                  <Button variant="danger" onClick={() => onDelete(song)}>Del</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}