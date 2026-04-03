import { Event } from '@/app/(dashboard)/events/page';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import EmptyState from '@/components/shared/EmptyState';
import styles from './EventList.module.css';

interface EventListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onView: (event: Event) => void;
  onDelete: (event: Event) => void;
  canManage: boolean;
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

export default function EventList({ events, onEdit, onView, onDelete, canManage }: EventListProps) {
  if (events.length === 0) {
    return <EmptyState title="No events found" description="Try adjusting filters or add a new event." />;
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Date</th>
            <th>Time</th>
            <th>Location</th>
            <th>Created By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} style={{ opacity: event.event_date < today ? 0.6 : 1 }}>
              <td>{event.title}</td>
              <td><Badge variant={typeVariant[event.event_type] ?? 'default'}>{event.event_type}</Badge></td>
              <td>{event.event_date}</td>
              <td>{event.event_time || '—'}</td>
              <td>{event.location || '—'}</td>
              <td>{event.created_by_name || '—'}</td>
              <td className={styles.actions}>
                <Button variant="outline" onClick={() => onView(event)}>View</Button>
                {canManage && (
                  <>
                    <Button variant="outline" onClick={() => onEdit(event)}>Edit</Button>
                    <Button variant="danger" onClick={() => onDelete(event)}>Del</Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}