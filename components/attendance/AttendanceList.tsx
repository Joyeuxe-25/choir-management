import { AttendanceRecord } from '@/types';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import EmptyState from '@/components/shared/EmptyState';
import styles from './AttendanceList.module.css';

interface AttendanceListProps {
  records: AttendanceRecord[];
  onEdit: (record: AttendanceRecord) => void;
  onView: (record: AttendanceRecord) => void;
  onDelete: (record: AttendanceRecord) => void;
}

const statusVariant: Record<string, 'success' | 'danger' | 'warning' | 'info'> = {
  present: 'success',
  absent: 'danger',
  excused: 'warning',
  late: 'info',
  Present: 'success',
  Absent: 'danger',
  Excused: 'warning',
  Late: 'info',
};

export default function AttendanceList({ records, onEdit, onView, onDelete }: AttendanceListProps) {
  if (records.length === 0) {
    return <EmptyState title="No attendance records found" description="Try adjusting filters or mark new attendance." />;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Member</th>
            <th>Voice</th>
            <th>Date</th>
            <th>Event</th>
            <th>Status</th>
            <th>Marked By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.member_name}</td>
              <td>{record.member_voice}</td>
              <td>{record.date}</td>
              <td>{record.event_type}</td>
              <td>
                <Badge variant={statusVariant[record.status] ?? 'info'}>
                  {record.status}
                </Badge>
              </td>
              <td>{record.marked_by_name || '—'}</td>
              <td className={styles.actions}>
                <Button variant="outline" onClick={() => onView(record)}>View</Button>
                <Button variant="outline" onClick={() => onEdit(record)}>Edit</Button>
                <Button variant="danger" onClick={() => onDelete(record)}>Del</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}