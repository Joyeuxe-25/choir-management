import { Event } from '@/app/(dashboard)/events/page';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import InfoRow from '@/components/shared/InfoRow';
import styles from './EventDetailModal.module.css';

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event;
}

const typeVariant: Record<string, any> = {
  'Rehearsal': 'info',
  'Sunday Service': 'success',
  'Meeting': 'warning',
  'Special Event': 'danger',
  'Concert': 'info',
  'Wedding': 'success',
  'Funeral': 'default',
};

export default function EventDetailModal({ isOpen, onClose, event }: EventDetailModalProps) {
  if (!isOpen || !event) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Event Details</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.content}>
          <InfoRow label="Title" value={event.title} />
          <InfoRow label="Type" value={<Badge variant={typeVariant[event.event_type] ?? 'default'}>{event.event_type}</Badge>} />
          <InfoRow label="Date" value={event.event_date} />
          <InfoRow label="Time" value={event.event_time || '—'} />
          <InfoRow label="Location" value={event.location || '—'} />
          <InfoRow label="Created By" value={event.created_by_name || '—'} />
          {event.description && (
            <div className={styles.description}>
              <label>Description</label>
              <p>{event.description}</p>
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