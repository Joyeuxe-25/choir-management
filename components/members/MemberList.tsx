import { Member } from '@/types';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import EmptyState from '@/components/shared/EmptyState';
import styles from './MemberList.module.css';

interface MemberListProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onView: (member: Member) => void;
}

export default function MemberList({ members, onEdit, onView }: MemberListProps) {
  if (members.length === 0) {
    return <EmptyState title="No members found" description="Try adjusting your filters or add a new member." />;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Voice</th>
            <th>Phone</th>
            <th>Join Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.name}</td>
              <td>{member.voice}</td>
              <td>{member.phone}</td>
              <td>{member.joinDate}</td>
              <td>
                <Badge variant={member.status === 'active' ? 'success' : 'danger'}>
                  {member.status}
                </Badge>
              </td>
              <td className={styles.actions}>
                <Button variant="outline" onClick={() => onView(member)}>View</Button>
                <Button variant="outline" onClick={() => onEdit(member)}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}