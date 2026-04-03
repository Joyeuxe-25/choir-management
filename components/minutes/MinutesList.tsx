import { Minute } from '@/types';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import EmptyState from '@/components/shared/EmptyState';
import styles from './MinutesList.module.css';

interface MinutesListProps {
  minutes: Minute[];
  onEdit: (minute: Minute) => void;
  onView: (minute: Minute) => void;
  onDelete: (minute: Minute) => void;
}

export default function MinutesList({ minutes, onEdit, onView, onDelete }: MinutesListProps) {
  if (minutes.length === 0) {
    return <EmptyState title="No minutes found" description="Try adjusting filters or add new minutes." />;
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString();
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Meeting Date</th>
            <th className={styles.hideSmall}>Recorded By</th>
            <th className={styles.hideMedium}>Last Updated</th>
            <th className={styles.hideSmall}>Attachment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {minutes.map((minute) => (
            <tr key={minute.id}>
              <td>{minute.title}</td>
              <td>{minute.meeting_date}</td>
              <td className={styles.hideSmall}>{minute.recorded_by_name || '—'}</td>
              <td className={styles.hideMedium}>{formatDate(minute.updated_at)}</td>
              <td className={styles.hideSmall}>
                {minute.attachment_present
                  ? <Badge variant="success">📎 Attached</Badge>
                  : <Badge variant="default">No attachment</Badge>
                }
              </td>
              <td className={styles.actions}>
                <Button variant="outline" onClick={() => onView(minute)}>View</Button>
                <Button variant="outline" onClick={() => onEdit(minute)}>Edit</Button>
                <Button variant="danger" onClick={() => onDelete(minute)}>Del</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}