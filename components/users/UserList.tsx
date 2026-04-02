import { User } from '@/types';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import EmptyState from '@/components/shared/EmptyState';
import { useRole } from '@/context/RoleContext';
import styles from './UserList.module.css';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onView: (user: User) => void;
  onDelete: (user: User) => void;
}

const roleVariant = {
  'Admin': 'danger',
  'Secretary': 'info',
  'Voice Leader': 'success',
} as const;

export default function UserList({ users, onEdit, onView, onDelete }: UserListProps) {
  const { role } = useRole();

  if (users.length === 0) {
    return <EmptyState title="No users found" description="Try adjusting filters or add a new user." />;
  }

  const formatDate = (dateStr: string) => {
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
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Voice</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Badge variant={roleVariant[user.role] ?? 'default'}>
                  {user.role}
                </Badge>
              </td>
              <td>{user.voice || '—'}</td>
              <td>
                <Badge variant={user.status === 'Active' ? 'success' : 'danger'}>
                  {user.status}
                </Badge>
              </td>
              <td>{formatDate(user.created_at)}</td>
              <td className={styles.actions}>
                <Button variant="outline" onClick={() => onView(user)}>View</Button>
                <Button variant="outline" onClick={() => onEdit(user)}>Edit</Button>
                {role === 'admin' && (
                  <Button variant="danger" onClick={() => onDelete(user)}>Delete</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}