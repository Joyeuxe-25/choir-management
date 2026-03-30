import { Song } from '@/types';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import EmptyState from '@/components/shared/EmptyState';
import styles from './SongList.module.css';

interface SongListProps {
  songs: Song[];
  onEdit: (song: Song) => void;
  onView: (song: Song) => void;
}

export default function SongList({ songs, onEdit, onView }: SongListProps) {
  if (songs.length === 0) {
    return <EmptyState title="No songs found" description="Try adjusting filters or add a new song." />;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Voice</th>
            <th>Language</th>
            <th>Upload Date</th>
            <th>File</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <tr key={song.id}>
              <td>{song.title}</td>
              <td>{song.category}</td>
              <td>{song.voice}</td>
              <td>{song.language}</td>
              <td>{song.uploadDate}</td>
              <td>
                {song.fileAttached ? (
                  <Badge variant="success">📄 Attached</Badge>
                ) : (
                  <Badge variant="default">No file</Badge>
                )}
              </td>
              <td className={styles.actions}>
                <Button variant="outline" onClick={() => onView(song)}>View</Button>
                <Button variant="outline" onClick={() => onEdit(song)}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}