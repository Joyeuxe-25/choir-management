import { Member } from '@/types';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import EmptyState from '@/components/shared/EmptyState';
import { useRole } from '@/context/RoleContext';
import styles from './MemberList.module.css';

interface MemberListProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onView: (member: Member) => void;
  onDelete: (member: Member) => void;
}

export default function MemberList({ members, onEdit, onView, onDelete }: MemberListProps) {
  const { role, voiceSection } = useRole();

  const visibleMembers = role === 'voiceLeader' && voiceSection
    ? members.filter(m => m.voice === voiceSection)
    : members;

  const canDelete = role === 'admin' || role === 'voiceLeader';

  if (visibleMembers.length === 0) {
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
          {visibleMembers.map((member) => (
            <tr key={member.id}>
              <td>{member.name}</td>
              <td>{member.voice}</td>
              <td>{member.phone}</td>
              <td>{member.join_date}</td>
              <td>
                <Badge variant={member.status === 'Active' ? 'success' : 'danger'}>
                  {member.status}
                </Badge>
              </td>
              <td className={styles.actions}>
                <Button variant="outline" onClick={() => onView(member)}>View</Button>
                <Button variant="outline" onClick={() => onEdit(member)}>Edit</Button>
                {canDelete && (
                  <Button variant="danger" onClick={() => onDelete(member)}>Del</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}