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
  const { role, voiceSection } = useRole();

  // Voice leaders only see songs for their section
  const visibleSongs = role === 'voiceLeader' && voiceSection
    ? songs.filter(s => s.voice === voiceSection || s.voice === 'Full Choir')
    : songs;

  const canDelete = role === 'admin' || role === 'voiceLeader';

  if (visibleSongs.length === 0) {
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
          {visibleSongs.map((song) => (
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
                {canDelete && (
                  <Button variant="danger" onClick={() => onDelete(song)}>Delete</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}