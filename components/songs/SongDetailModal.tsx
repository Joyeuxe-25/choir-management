import { Song } from '@/types';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import InfoRow from '@/components/shared/InfoRow';
import styles from './SongDetailModal.module.css';

interface SongDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  song?: Song;
}

export default function SongDetailModal({ isOpen, onClose, song }: SongDetailModalProps) {
  if (!isOpen || !song) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Song Details</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.content}>
          <InfoRow label="Title" value={song.title} />
          <InfoRow label="Category" value={song.category} />
          <InfoRow label="Voice" value={song.voice} />
          <InfoRow label="Language" value={song.language} />
          <InfoRow label="Upload Date" value={song.upload_date} />
          <InfoRow label="File" value={song.file_present
            ? <Badge variant="success">📄 {song.file_name || 'Attached'}</Badge>
            : <Badge variant="default">No file</Badge>}
          />
          {song.file_present && (
            <div className={styles.filePreview}>
              <label>Song File</label>
              <div className={styles.previewBox}>
                📄 {song.file_name || song.title}
                <button className={styles.downloadButton} disabled>Download</button>
              </div>
            </div>
          )}
        </div>
        <div className={styles.footer}>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}