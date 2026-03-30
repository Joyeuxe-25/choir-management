import { Minute } from '@/types';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import InfoRow from '@/components/shared/InfoRow';
import styles from './MinuteDetailModal.module.css';

interface MinuteDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  minute?: Minute;
}

export default function MinuteDetailModal({ isOpen, onClose, minute }: MinuteDetailModalProps) {
  if (!isOpen || !minute) return null;

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Minutes Details</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.content}>
          <InfoRow label="Title" value={minute.title} />
          <InfoRow label="Meeting Date" value={minute.meetingDate} />
          <InfoRow label="Recorded By" value={minute.recordedBy} />
          <InfoRow label="Created" value={formatDateTime(minute.createdAt)} />
          <InfoRow label="Last Updated" value={formatDateTime(minute.updatedAt)} />
          <InfoRow label="Attachment" value={minute.hasAttachment ? <Badge variant="success">📎 Attached</Badge> : <Badge variant="default">No attachment</Badge>} />
          <div className={styles.contentSection}>
            <label>Meeting Content</label>
            <div className={styles.contentBody}>{minute.content}</div>
          </div>
          {minute.hasAttachment && (
            <div className={styles.filePreview}>
              <label>Attachment Preview (placeholder)</label>
              <div className={styles.previewBox}>
                📎 {minute.title}.pdf
                <button className={styles.downloadButton} disabled>Download (demo)</button>
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